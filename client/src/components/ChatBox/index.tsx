import { ReactNode } from 'react'
import './style.css'

interface Props {
  children: ReactNode
}

export const ChatBox = {
  Message: ({ children }: Props) => (
    <div className="box">
      <div className="chat">
        {children}
      </div>
    </div>
  )
}


