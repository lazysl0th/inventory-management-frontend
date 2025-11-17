import { Link } from 'react-router-dom';

export default function PageNotFound () {
  return (
    <section>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/">Назад</Link>
    </section>
  )
}