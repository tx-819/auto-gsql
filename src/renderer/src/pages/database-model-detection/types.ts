// 列信息接口
export interface ColumnInfo {
  name: string
  type: string
  nullable: boolean
  isPrimaryKey: boolean
  isForeignKey: boolean
}

// 外键信息接口
export interface ForeignKeyInfo {
  column: string
  referencedTable: string
  referencedColumn: string
  constraintName: string
}

// 表信息接口
export interface TableInfo {
  name: string
  columns: ColumnInfo[]
  primaryKey: string
  foreignKeys: ForeignKeyInfo[]
  rowCount: number
}

// 表关联关系接口
export interface TableRelation {
  sourceTable: string
  sourceColumn: string
  targetTable: string
  targetColumn: string
  relationType: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many'
  isConfigured: boolean
}
