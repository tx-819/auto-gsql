import mysql, { QueryResult, RowDataPacket } from 'mysql2/promise'
import { ipcMain } from 'electron'

// 定义数据库结构相关的接口
interface TableInfo extends RowDataPacket {
  TABLE_NAME: string
  TABLE_COMMENT: string
  TABLE_ROWS: number
}

interface ColumnInfo extends RowDataPacket {
  COLUMN_NAME: string
  DATA_TYPE: string
  IS_NULLABLE: string
  IS_PRIMARY_KEY: string
  COLUMN_COMMENT: string
  CHARACTER_MAXIMUM_LENGTH: number | null
}

export interface DbColumnInfo {
  columnName: string
  dataType: string
  isNullable: boolean
  isPrimary: boolean
  isForeignKey?: boolean
  columnComment: string
}

export interface DbTableInfo {
  tableName: string
  tableComment: string
  columns: DbColumnInfo[]
  primaryKey: string
}

export interface DbConnection {
  id: number
  name: string
  dbType: string
  host: string
  port: string
  databaseName: string
  username: string
  password: string
}

export interface ConnectionResult {
  success: boolean
  message: string
  error?: string
}

class DatabaseService {
  private connections: Map<string, mysql.Connection> = new Map()

  async testConnection(config: DbConnection): Promise<ConnectionResult> {
    try {
      if (config.dbType === 'mysql') {
        const connection = await mysql.createConnection({
          host: config.host,
          port: parseInt(config.port),
          user: config.username,
          password: config.password,
          database: config.databaseName
        })

        // 测试连接
        await connection.ping()
        await connection.end()

        return {
          success: true,
          message: '连接成功！'
        }
      }

      return {
        success: false,
        message: '不支持的数据库类型'
      }
    } catch (error) {
      console.error('数据库连接测试失败:', error)
      return {
        success: false,
        message: '连接失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async createConnection(config: DbConnection): Promise<ConnectionResult> {
    try {
      if (config.dbType === 'mysql') {
        const connection = await mysql.createConnection({
          host: config.host,
          port: parseInt(config.port),
          user: config.username,
          password: config.password,
          database: config.databaseName
        })

        // 测试连接
        await connection.ping()

        // 保存连接
        this.connections.set(config.name, connection)

        return {
          success: true,
          message: '连接创建成功！'
        }
      }

      return {
        success: false,
        message: '不支持的数据库类型'
      }
    } catch (error) {
      console.error('数据库连接创建失败:', error)
      return {
        success: false,
        message: '连接创建失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async closeConnection(connectionName: string): Promise<ConnectionResult> {
    try {
      const connection = this.connections.get(connectionName)
      if (connection) {
        await connection.end()
        this.connections.delete(connectionName)
        return {
          success: true,
          message: '连接已关闭'
        }
      }
      return {
        success: false,
        message: '连接不存在'
      }
    } catch (error) {
      console.error('关闭数据库连接失败:', error)
      return {
        success: false,
        message: '关闭连接失败',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  async executeQuery(connectionName: string, query: string): Promise<QueryResult> {
    try {
      const connection = this.connections.get(connectionName)
      if (!connection) {
        throw new Error('连接不存在')
      }

      const [rows] = await connection.execute(query)
      return rows
    } catch (error) {
      console.error('执行查询失败:', error)
      throw error
    }
  }

  getConnection(connectionName: string): mysql.Connection | undefined {
    return this.connections.get(connectionName)
  }

  async getConnectionStatus(connectionName: string): Promise<boolean> {
    const connection = this.connections.get(connectionName)
    if (connection) {
      try {
        await connection.ping()
        return true
      } catch (error) {
        console.error('获取连接状态失败:', error)
        return false
      }
    }
    return false
  }

  getAllConnections(): string[] {
    return Array.from(this.connections.keys())
  }

  async scanDatabase(config: DbConnection): Promise<{
    dbTableInfo: DbTableInfo[]
    uniqueArrayCols: string[]
  }> {
    // 验证参数
    if (!config.databaseName) {
      throw new Error('数据库名称不能为空')
    }

    if (!config.name) {
      throw new Error('连接名称不能为空')
    }

    let conn = this.connections.get(config.name)

    if (!conn) {
      const result = await this.createConnection(config)
      if (!result.success) {
        throw new Error(result.message)
      }
      conn = this.connections.get(config.name)
      if (!conn) {
        throw new Error('连接创建失败')
      }
    }
    try {
      // 1. 获取表信息
      console.log('正在查询数据库:', config.databaseName)
      const tableParams = [config.databaseName]
      console.log('表查询参数:', tableParams)

      const [tables] = (await conn.execute(
        `SELECT TABLE_NAME, TABLE_COMMENT, TABLE_ROWS
         FROM information_schema.tables
         WHERE table_schema = ?`,
        tableParams
      )) as [TableInfo[], mysql.FieldPacket[]]

      console.log('查询到的表数量:', tables.length)
      console.log(
        'tables:',
        tables.map((t) => ({ name: t.TABLE_NAME, comment: t.TABLE_COMMENT }))
      )

      const dbTableInfo: DbTableInfo[] = []

      // 2. 获取每个表的列信息
      for (const table of tables) {
        if (!table.TABLE_NAME) {
          console.warn('跳过表名为空的表')
          continue
        }

        console.log(`正在查询表 ${table.TABLE_NAME} 的列信息`)
        const columnParams = [config.databaseName, table.TABLE_NAME]
        console.log('列查询参数:', columnParams)

        const [columns] = (await conn.execute(
          `SELECT 
             c.COLUMN_NAME,
             c.DATA_TYPE,
             c.IS_NULLABLE,
             c.COLUMN_COMMENT,
             c.CHARACTER_MAXIMUM_LENGTH,
             CASE WHEN kcu.COLUMN_NAME IS NOT NULL THEN 'YES' ELSE 'NO' END as IS_PRIMARY_KEY
           FROM information_schema.columns c
           LEFT JOIN information_schema.key_column_usage kcu 
             ON c.table_schema = kcu.table_schema 
             AND c.table_name = kcu.table_name 
             AND c.column_name = kcu.column_name
             AND kcu.constraint_name = 'PRIMARY'
           WHERE c.table_schema = ? AND c.table_name = ?
           ORDER BY c.ORDINAL_POSITION`,
          columnParams
        )) as [ColumnInfo[], mysql.FieldPacket[]]

        console.log(`Table ${table.TABLE_NAME} columns:`, columns)

        // 提取主键列
        const primaryKeyColumns = columns.filter((col) => col.IS_PRIMARY_KEY === 'YES')
        console.log(
          `Table ${table.TABLE_NAME} primary key columns:`,
          primaryKeyColumns.map((col) => col.COLUMN_NAME)
        )

        dbTableInfo.push({
          tableName: table.TABLE_NAME,
          tableComment: table.TABLE_COMMENT,
          columns: columns.map((col) => ({
            columnName: col.COLUMN_NAME,
            dataType:
              col.DATA_TYPE === 'varchar'
                ? `${col.DATA_TYPE}(${col.CHARACTER_MAXIMUM_LENGTH})`
                : col.DATA_TYPE,
            isNullable: col.IS_NULLABLE === 'YES',
            isPrimary: col.IS_PRIMARY_KEY === 'YES',
            columnComment: col.COLUMN_COMMENT
          })),
          primaryKey: primaryKeyColumns.map((col) => col.COLUMN_NAME).join(',')
        })
      }

      const [uniqueCols] = (await conn.execute(
        `SELECT table_name, column_name
           FROM information_schema.statistics
           WHERE table_schema = ? AND NON_UNIQUE = 0`,
        [config.databaseName]
      )) as [
        {
          TABLE_NAME: string
          COLUMN_NAME: string
        }[],
        mysql.FieldPacket[]
      ]
      console.log('uniqueCols:', uniqueCols)
      const uniqueSet = new Set(uniqueCols.map((u) => `${u.TABLE_NAME}.${u.COLUMN_NAME}`))
      console.log('uniqueSet:', uniqueSet)
      console.log('数据库结构已导入元信息表')
      return { dbTableInfo, uniqueArrayCols: Array.from(uniqueSet) }
    } catch (error) {
      console.error('扫描数据库失败:', error)
      throw error
    } finally {
      await conn.end()
    }
  }
}

const databaseService = new DatabaseService()

// 注册IPC处理器
export function registerDatabaseHandlers(): void {
  ipcMain.handle('database:test-connection', async (_, config: DbConnection) => {
    return await databaseService.testConnection(config)
  })

  ipcMain.handle('database:create-connection', async (_, config: DbConnection) => {
    return await databaseService.createConnection(config)
  })

  ipcMain.handle('database:close-connection', async (_, connectionName: string) => {
    return await databaseService.closeConnection(connectionName)
  })

  ipcMain.handle('database:execute-query', async (_, connectionName: string, query: string) => {
    return await databaseService.executeQuery(connectionName, query)
  })

  ipcMain.handle('database:get-connections', () => {
    return databaseService.getAllConnections()
  })

  ipcMain.handle('database:get-connection-status', async (_, connectionName: string) => {
    return await databaseService.getConnectionStatus(connectionName)
  })

  ipcMain.handle('database:scan-database', async (_, config: DbConnection) => {
    return await databaseService.scanDatabase(config)
  })
}

export { databaseService }
