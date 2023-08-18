import styles from './index.module.scss';

function LoaderWidget({ active }) {
  if (!active) return null;
  return (
    <div className={styles.loader} />
  )
}
export default LoaderWidget;
