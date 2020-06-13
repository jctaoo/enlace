// todo 查看其他方法

export default class ObservableMap<K, V> extends Map {
  #observer: Array<Function> = [];

  public observeChange(block: (updated: { key: K, value: V }) => void) {
    this.#observer.push(block);
  }

  // @ts-ignore
  public set(key: K, value: V): ObservableMap<K, V> {
    super.set(key, value);
    this.callObservers({ key, value });
    return this;
  }

  private callObservers(change: { key: K, value: V }) {
    this.#observer.forEach(obs => {
      obs(change);
    });
  }

}