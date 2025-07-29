import { TableInfo, TableRelation } from './types'

// 模拟表结构数据
export const mockTables: TableInfo[] = [
  {
    name: 'users',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      {
        name: 'username',
        type: 'VARCHAR(50)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'email',
        type: 'VARCHAR(100)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [],
    rowCount: 1250
  },
  {
    name: 'orders',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'user_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      {
        name: 'total_amount',
        type: 'DECIMAL(10,2)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      { name: 'status', type: 'ENUM', nullable: false, isPrimaryKey: false, isForeignKey: false },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'user_id',
        referencedTable: 'users',
        referencedColumn: 'id',
        constraintName: 'fk_orders_user'
      }
    ],
    rowCount: 3420
  },
  {
    name: 'products',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      {
        name: 'name',
        type: 'VARCHAR(100)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'price',
        type: 'DECIMAL(10,2)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      { name: 'category_id', type: 'INT', nullable: true, isPrimaryKey: false, isForeignKey: true }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'category_id',
        referencedTable: 'categories',
        referencedColumn: 'id',
        constraintName: 'fk_products_category'
      }
    ],
    rowCount: 156
  },
  {
    name: 'categories',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      {
        name: 'name',
        type: 'VARCHAR(50)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'description',
        type: 'TEXT',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [],
    rowCount: 12
  },
  {
    name: 'order_items',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'order_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      { name: 'product_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      { name: 'quantity', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: false },
      {
        name: 'unit_price',
        type: 'DECIMAL(10,2)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'order_id',
        referencedTable: 'orders',
        referencedColumn: 'id',
        constraintName: 'fk_order_items_order'
      },
      {
        column: 'product_id',
        referencedTable: 'products',
        referencedColumn: 'id',
        constraintName: 'fk_order_items_product'
      }
    ],
    rowCount: 8560
  },
  {
    name: 'user_profiles',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'user_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      {
        name: 'first_name',
        type: 'VARCHAR(50)',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'last_name',
        type: 'VARCHAR(50)',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'phone',
        type: 'VARCHAR(20)',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'user_id',
        referencedTable: 'users',
        referencedColumn: 'id',
        constraintName: 'fk_user_profiles_user'
      }
    ],
    rowCount: 1250
  },
  {
    name: 'product_reviews',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'product_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      { name: 'user_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      { name: 'rating', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: false },
      { name: 'comment', type: 'TEXT', nullable: true, isPrimaryKey: false, isForeignKey: false },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'product_id',
        referencedTable: 'products',
        referencedColumn: 'id',
        constraintName: 'fk_product_reviews_product'
      },
      {
        column: 'user_id',
        referencedTable: 'users',
        referencedColumn: 'id',
        constraintName: 'fk_product_reviews_user'
      }
    ],
    rowCount: 2340
  },
  {
    name: 'shipping_addresses',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'user_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      {
        name: 'address_line1',
        type: 'VARCHAR(255)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'address_line2',
        type: 'VARCHAR(255)',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'city',
        type: 'VARCHAR(100)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'state',
        type: 'VARCHAR(50)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'postal_code',
        type: 'VARCHAR(20)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'country',
        type: 'VARCHAR(50)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'is_default',
        type: 'BOOLEAN',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'user_id',
        referencedTable: 'users',
        referencedColumn: 'id',
        constraintName: 'fk_shipping_addresses_user'
      }
    ],
    rowCount: 2100
  },
  {
    name: 'payment_methods',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'user_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      {
        name: 'card_type',
        type: 'VARCHAR(20)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'card_last4',
        type: 'VARCHAR(4)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'expiry_month',
        type: 'INT',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'expiry_year',
        type: 'INT',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'is_default',
        type: 'BOOLEAN',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'user_id',
        referencedTable: 'users',
        referencedColumn: 'id',
        constraintName: 'fk_payment_methods_user'
      }
    ],
    rowCount: 1800
  },
  {
    name: 'product_images',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'product_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      {
        name: 'image_url',
        type: 'VARCHAR(500)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'alt_text',
        type: 'VARCHAR(200)',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'is_primary',
        type: 'BOOLEAN',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'sort_order',
        type: 'INT',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'product_id',
        referencedTable: 'products',
        referencedColumn: 'id',
        constraintName: 'fk_product_images_product'
      }
    ],
    rowCount: 468
  },
  {
    name: 'product_tags',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      {
        name: 'name',
        type: 'VARCHAR(50)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'description',
        type: 'TEXT',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'color',
        type: 'VARCHAR(7)',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [],
    rowCount: 45
  },
  {
    name: 'product_tag_relations',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'product_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      { name: 'tag_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'product_id',
        referencedTable: 'products',
        referencedColumn: 'id',
        constraintName: 'fk_product_tag_relations_product'
      },
      {
        column: 'tag_id',
        referencedTable: 'product_tags',
        referencedColumn: 'id',
        constraintName: 'fk_product_tag_relations_tag'
      }
    ],
    rowCount: 312
  },
  {
    name: 'order_status_history',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'order_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      {
        name: 'status',
        type: 'VARCHAR(50)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      { name: 'notes', type: 'TEXT', nullable: true, isPrimaryKey: false, isForeignKey: false },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      { name: 'created_by', type: 'INT', nullable: true, isPrimaryKey: false, isForeignKey: true }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'order_id',
        referencedTable: 'orders',
        referencedColumn: 'id',
        constraintName: 'fk_order_status_history_order'
      },
      {
        column: 'created_by',
        referencedTable: 'users',
        referencedColumn: 'id',
        constraintName: 'fk_order_status_history_user'
      }
    ],
    rowCount: 6840
  },
  {
    name: 'wishlists',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'user_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      {
        name: 'name',
        type: 'VARCHAR(100)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'description',
        type: 'TEXT',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'is_public',
        type: 'BOOLEAN',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'user_id',
        referencedTable: 'users',
        referencedColumn: 'id',
        constraintName: 'fk_wishlists_user'
      }
    ],
    rowCount: 890
  },
  {
    name: 'wishlist_items',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      {
        name: 'wishlist_id',
        type: 'INT',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: true
      },
      { name: 'product_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      {
        name: 'added_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      { name: 'notes', type: 'TEXT', nullable: true, isPrimaryKey: false, isForeignKey: false }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'wishlist_id',
        referencedTable: 'wishlists',
        referencedColumn: 'id',
        constraintName: 'fk_wishlist_items_wishlist'
      },
      {
        column: 'product_id',
        referencedTable: 'products',
        referencedColumn: 'id',
        constraintName: 'fk_wishlist_items_product'
      }
    ],
    rowCount: 1560
  },
  {
    name: 'coupons',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      {
        name: 'code',
        type: 'VARCHAR(20)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'discount_type',
        type: 'ENUM',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'discount_value',
        type: 'DECIMAL(10,2)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'min_order_amount',
        type: 'DECIMAL(10,2)',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false
      },
      { name: 'max_uses', type: 'INT', nullable: true, isPrimaryKey: false, isForeignKey: false },
      {
        name: 'used_count',
        type: 'INT',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'valid_from',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'valid_until',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'is_active',
        type: 'BOOLEAN',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [],
    rowCount: 28
  },
  {
    name: 'order_coupons',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true, isForeignKey: false },
      { name: 'order_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      { name: 'coupon_id', type: 'INT', nullable: false, isPrimaryKey: false, isForeignKey: true },
      {
        name: 'discount_amount',
        type: 'DECIMAL(10,2)',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      },
      {
        name: 'applied_at',
        type: 'TIMESTAMP',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false
      }
    ],
    primaryKey: 'id',
    foreignKeys: [
      {
        column: 'order_id',
        referencedTable: 'orders',
        referencedColumn: 'id',
        constraintName: 'fk_order_coupons_order'
      },
      {
        column: 'coupon_id',
        referencedTable: 'coupons',
        referencedColumn: 'id',
        constraintName: 'fk_order_coupons_coupon'
      }
    ],
    rowCount: 1250
  }
]

// 模拟关联关系数据
export const mockRelations: TableRelation[] = [
  {
    sourceTable: 'orders',
    sourceColumn: 'user_id',
    targetTable: 'users',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'products',
    sourceColumn: 'category_id',
    targetTable: 'categories',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'order_items',
    sourceColumn: 'order_id',
    targetTable: 'orders',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'order_items',
    sourceColumn: 'product_id',
    targetTable: 'products',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'user_profiles',
    sourceColumn: 'user_id',
    targetTable: 'users',
    targetColumn: 'id',
    relationType: 'one-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'product_reviews',
    sourceColumn: 'product_id',
    targetTable: 'products',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'product_reviews',
    sourceColumn: 'user_id',
    targetTable: 'users',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: false
  },
  {
    sourceTable: 'shipping_addresses',
    sourceColumn: 'user_id',
    targetTable: 'users',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'payment_methods',
    sourceColumn: 'user_id',
    targetTable: 'users',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'product_images',
    sourceColumn: 'product_id',
    targetTable: 'products',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'product_tag_relations',
    sourceColumn: 'product_id',
    targetTable: 'products',
    targetColumn: 'id',
    relationType: 'many-to-many',
    isConfigured: true
  },
  {
    sourceTable: 'product_tag_relations',
    sourceColumn: 'tag_id',
    targetTable: 'product_tags',
    targetColumn: 'id',
    relationType: 'many-to-many',
    isConfigured: true
  },
  {
    sourceTable: 'order_status_history',
    sourceColumn: 'order_id',
    targetTable: 'orders',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'order_status_history',
    sourceColumn: 'created_by',
    targetTable: 'users',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: false
  },
  {
    sourceTable: 'wishlists',
    sourceColumn: 'user_id',
    targetTable: 'users',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'wishlist_items',
    sourceColumn: 'wishlist_id',
    targetTable: 'wishlists',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'wishlist_items',
    sourceColumn: 'product_id',
    targetTable: 'products',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'order_coupons',
    sourceColumn: 'order_id',
    targetTable: 'orders',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'order_coupons',
    sourceColumn: 'coupon_id',
    targetTable: 'coupons',
    targetColumn: 'id',
    relationType: 'many-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'user_profiles',
    sourceColumn: 'user_id',
    targetTable: 'users',
    targetColumn: 'id',
    relationType: 'one-to-one',
    isConfigured: true
  },
  {
    sourceTable: 'shipping_addresses',
    sourceColumn: 'user_id',
    targetTable: 'user_profiles',
    targetColumn: 'user_id',
    relationType: 'one-to-many',
    isConfigured: false
  },
  {
    sourceTable: 'payment_methods',
    sourceColumn: 'user_id',
    targetTable: 'user_profiles',
    targetColumn: 'user_id',
    relationType: 'one-to-many',
    isConfigured: false
  },
  {
    sourceTable: 'orders',
    sourceColumn: 'user_id',
    targetTable: 'payment_methods',
    targetColumn: 'user_id',
    relationType: 'one-to-many',
    isConfigured: false
  },
  {
    sourceTable: 'orders',
    sourceColumn: 'user_id',
    targetTable: 'shipping_addresses',
    targetColumn: 'user_id',
    relationType: 'one-to-many',
    isConfigured: false
  }
]
