import './style.css'
import React, { useEffect, useRef, useState } from "react"

type Props = {
  message: string
  duration: number
  onTrigger: () => void
}

export const Notify = {
  Success: ({ message, duration, onTrigger }: Props) => {
    const notify = useRef<HTMLDivElement>(null)
    const [hasTrigger, setHasTrigger] = useState(false)
    return (
      <React.Fragment>
        {
          hasTrigger && <div ref={notify} className="success">
            <span className="content">
              <h3>{message}</h3>
            </span>
          </div>
        }
      </React.Fragment>
    )
  },
  Error: ({ message, duration, onTrigger }: Props) => {
    const notify = useRef<HTMLDivElement>(null)
    return (
      <div ref={notify} className="success hide-notify">
        <span className="content">
          <h3>{message}</h3>
        </span>
      </div>
    )
  }
}
