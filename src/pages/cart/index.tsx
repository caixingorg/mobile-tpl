import { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { AppstoreOutline } from 'antd-mobile-icons';
import LazyImage from '@/components/LazyImage';
import styles from './index.module.css';

// 购物车数据
const cartData = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro Max 256GB 钛金属',
    spec: '深空黑色; 256GB',
    price: 9999,
    quantity: 1,
    image: 'https://placehold.co/200x200/333/white?text=iPhone',
    checked: true,
  },
  {
    id: 2,
    name: '索尼 WH-1000XM5 头戴式降噪耳机',
    spec: '黑色',
    price: 2499,
    quantity: 1,
    image: 'https://placehold.co/200x200/666/white?text=Sony',
    checked: true,
  },
  {
    id: 3,
    name: 'Nike Air Force 1 空军一号板鞋',
    spec: '白色; 42码',
    price: 749,
    quantity: 2,
    image: 'https://placehold.co/200x200/ff6b6b/white?text=Nike',
    checked: false,
  },
];

// 购物车项组件 - 使用 memo 优化
interface CartItemData {
  id: number;
  name: string;
  spec: string;
  price: number;
  quantity: number;
  image: string;
  checked: boolean;
}

interface CartItemProps {
  item: CartItemData;
  isEdit: boolean;
  onCheck: (id: number) => void;
  onQuantityChange: (id: number, delta: number) => void;
  onDelete: (id: number) => void;
}

const CartItem = memo(({ item, isEdit, onCheck, onQuantityChange, onDelete }: CartItemProps) => {
  const handleCheck = useCallback(() => onCheck(item.id), [item.id, onCheck]);
  const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);
  const handleDecrease = useCallback(
    () => onQuantityChange(item.id, -1),
    [item.id, onQuantityChange]
  );
  const handleIncrease = useCallback(
    () => onQuantityChange(item.id, 1),
    [item.id, onQuantityChange]
  );

  return (
    <div className={styles.cartItem}>
      <div
        className={item.checked ? styles.checkboxChecked : styles.checkbox}
        onClick={handleCheck}
      />
      <LazyImage src={item.image} alt={item.name} className={styles.productImage} />
      <div className={styles.productInfo}>
        <div className={styles.productName}>{item.name}</div>
        <div className={styles.productSpec}>{item.spec}</div>
        <div className={styles.productPriceRow}>
          <span className={styles.productPrice}>¥{item.price}</span>
          {isEdit ? (
            <span
              style={{ color: '#ff5000', fontSize: 13, cursor: 'pointer' }}
              onClick={handleDelete}
            >
              删除
            </span>
          ) : (
            <div className={styles.quantityControl}>
              <button className={styles.quantityBtn} onClick={handleDecrease}>
                -
              </button>
              <span className={styles.quantityValue}>{item.quantity}</span>
              <button className={styles.quantityBtn} onClick={handleIncrease}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(cartData);
  const [isEdit, setIsEdit] = useState(false);

  const handleCheck = (id: number) => {
    setCart(cart.map(item => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const handleSelectAll = () => {
    const allChecked = cart.every(item => item.checked);
    setCart(cart.map(item => ({ ...item, checked: !allChecked })));
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setCart(
      cart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  const handleDelete = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
    Toast.show({ icon: 'success', content: '已删除' });
  };

  const selectedItems = cart.filter(item => item.checked);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>购物车</span>
        </div>
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>
            <AppstoreOutline style={{ fontSize: 80, color: '#ddd' }} />
          </div>
          <div className={styles.emptyText}>购物车是空的</div>
          <button className={styles.emptyBtn} onClick={() => navigate('/')}>
            去逛逛
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>购物车({cart.length})</span>
        <span className={styles.manageBtn} onClick={() => setIsEdit(!isEdit)}>
          {isEdit ? '完成' : '管理'}
        </span>
      </div>

      <div className={styles.cartList}>
        {cart.map(item => (
          <CartItem
            key={item.id}
            item={item}
            isEdit={isEdit}
            onCheck={handleCheck}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.selectAll} onClick={handleSelectAll}>
          <div className={cart.every(i => i.checked) ? styles.checkboxChecked : styles.checkbox} />
          <span>全选</span>
        </div>
        <div className={styles.totalSection}>
          {!isEdit && (
            <div className={styles.totalPrice}>
              合计: <span className={styles.totalPriceValue}>¥{totalPrice}</span>
            </div>
          )}
          <button
            className={styles.checkoutBtn}
            onClick={() => {
              if (isEdit) {
                setCart(cart.filter(item => !item.checked));
                Toast.show({ icon: 'success', content: '删除成功' });
              } else {
                Toast.show({ icon: 'success', content: `结算 ${totalCount} 件商品` });
              }
            }}
          >
            {isEdit ? '删除' : `结算(${totalCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
