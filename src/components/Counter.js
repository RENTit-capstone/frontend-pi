export default function Counter(props) {
  const id = Math.random().toString(36).substring(2, 8);
  const { count, setCount } = props;

  return {
    html: `
      <div>
        <h2 id="count-${id}">Counter: ${count()}</h2>
        <button id="plus-${id}">+1</button>
      </div>
    `,
    handlers: {
      [`plus-${id}`]: () => {
        setCount(count() + 1);
        console.log(count());
      },
    }
  };
}
