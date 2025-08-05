import { ApiResponse, request } from './api'

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
