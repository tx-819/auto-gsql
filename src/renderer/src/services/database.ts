import { ApiResponse, request } from './api'

export interface DbColumnInfo {
  columnName: string
  dataType: string
  isNullable: boolean
  isForeignKey?: boolean
  isPrimary: boolean
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
  username: string
  databaseName: string
  password: string
}

export interface ConnectionResult {
  success: boolean
  message: string
  error?: string
}

export enum RelationType {
  ONE_TO_ONE = 'one-to-one',
  ONE_TO_MANY = 'one-to-many',
  MANY_TO_MANY = 'many-to-many'
}

export interface DbLogicForeignKey {
  id: number
  sourceTableId: number
  sourceTableName: string
  sourceColumnName: string
  targetTableId: number
  targetTableName: string
  targetColumnName: string
  relationType: RelationType
}

export async function testConnection(config: DbConnection): Promise<ConnectionResult> {
  try {
    return await window.api.database.testConnection(config)
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '测试连接失败'
    }
  }
}

export async function scanDatabase(
  config: DbConnection
): Promise<{ dbTableInfo: DbTableInfo[]; uniqueArrayCols: string[] }> {
  try {
    return await window.api.database.scanDatabase(config)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '扫描数据库失败')
  }
}

export async function getConnectionStatus(connectionName: string): Promise<boolean> {
  try {
    return await window.api.database.getConnectionStatus(connectionName)
  } catch {
    return false
  }
}

export async function createConnection(config: DbConnection): Promise<ConnectionResult> {
  try {
    return await window.api.database.createConnection(config)
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '创建连接失败'
    }
  }
}

export async function getConnection(connectionId: number): Promise<ApiResponse<DbConnection>> {
  const response = await request<DbConnection>(`/database/connection/${connectionId}`, {
    method: 'GET'
  })
  return response as ApiResponse<DbConnection>
}

export async function closeConnection(connectionName: string): Promise<ConnectionResult> {
  try {
    return await window.api.database.closeConnection(connectionName)
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '关闭连接失败'
    }
  }
}

export async function executeQuery(connectionName: string, query: string): Promise<unknown> {
  try {
    return await window.api.database.executeQuery(connectionName, query)
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '执行查询失败')
  }
}

export const getConnectionList = async (): Promise<ApiResponse<DbConnection[]>> => {
  const response = await request<DbConnection[]>('/database/connections', {
    method: 'GET'
  })
  return response as ApiResponse<DbConnection[]>
}

export const saveConnection = async (config: DbConnection): Promise<ApiResponse<DbConnection>> => {
  const response = await request<DbConnection>('/database/connection', {
    method: 'POST',
    body: JSON.stringify(config)
  })
  return response as ApiResponse<DbConnection>
}

export const updateConnection = async (
  config: DbConnection
): Promise<ApiResponse<DbConnection>> => {
  const response = await request<DbConnection>(`/database/connection/${config.id}`, {
    method: 'PUT',
    body: JSON.stringify(config)
  })
  return response as ApiResponse<DbConnection>
}

export const deleteConnection = async (
  connectionId: number
): Promise<ApiResponse<DbConnection>> => {
  const response = await request<DbConnection>(`/database/connection/${connectionId}`, {
    method: 'DELETE'
  })
  return response as ApiResponse<DbConnection>
}

export const generateDatabaseMetadata = async (
  connectionId: number,
  tables: DbTableInfo[],
  uniqueCols: string[]
): Promise<ApiResponse<{ tables: DbTableInfo[]; foreignKeys: DbLogicForeignKey[] }>> => {
  const response = await request<{ tables: DbTableInfo[]; foreignKeys: DbLogicForeignKey[] }>(
    `/database/generate-database-metadata`,
    {
      method: 'POST',
      body: JSON.stringify({ connectionId, tables, uniqueCols })
    }
  )
  return response as ApiResponse<{ tables: DbTableInfo[]; foreignKeys: DbLogicForeignKey[] }>
}

export const getTablesWithColumns = async (
  connectionId: number
): Promise<ApiResponse<DbTableInfo[]>> => {
  const params = new URLSearchParams({
    connectionId: connectionId.toString()
  })
  const response = await request<DbTableInfo[]>(
    `/database/tables-with-columns?${params.toString()}`,
    {
      method: 'GET'
    }
  )
  return response as ApiResponse<DbTableInfo[]>
}
