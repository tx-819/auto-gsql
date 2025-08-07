import { DbLogicForeignKey } from '../../../services/database'

/**
 * 获取关联关系类型的颜色
 */
export const getRelationTypeColor = (
  type: string
): 'primary' | 'secondary' | 'info' | 'warning' | 'default' => {
  switch (type) {
    case 'one-to-one':
      return 'primary'
    case 'one-to-many':
      return 'secondary'
    case 'many-to-one':
      return 'info'
    case 'many-to-many':
      return 'warning'
    default:
      return 'default'
  }
}

/**
 * 获取指定表的所有关联关系
 */
export const getTableRelations = (
  tableName: string,
  relations: Partial<DbLogicForeignKey>[]
): Partial<DbLogicForeignKey>[] => {
  return relations.filter(
    (relation) => relation.sourceTableName === tableName || relation.targetTableName === tableName
  )
}

/**
 * 检查关联关系是否相等
 */
export const isSameRelation = (
  relation1: Partial<DbLogicForeignKey>,
  relation2: Partial<DbLogicForeignKey>
): boolean => {
  return (
    relation1.sourceTableId === relation2.sourceTableId &&
    relation1.sourceColumnName === relation2.sourceColumnName &&
    relation1.targetTableId === relation2.targetTableId &&
    relation1.targetColumnName === relation2.targetColumnName
  )
}
