import './style.css'
import { Input } from '../Input'

export const Floater = {
  Media: () => {
    return (
      <div className="floater">
        <div className="item">
          <Input.File name='media' label='Upload' />
        </div>
      </div>
    )
  }
}
