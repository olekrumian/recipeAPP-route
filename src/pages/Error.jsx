import { Link, useNavigate, useRouteError } from 'react-router-dom'

const Error = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="error">
      <h1>Ой!</h1>
      <p>
        Повернутись <a onClick={() => navigate(-1)}>назад</a> або на
        <Link to="/">головну</Link> {error}
      </p>
    </div>
  )
}

export default Error
