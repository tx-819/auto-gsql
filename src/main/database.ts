import mysql, { QueryResult } from 'mysql2/promise'
import { ipcMain } from 'electron'

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
}

export { databaseService }
