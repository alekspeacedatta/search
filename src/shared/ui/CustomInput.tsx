import  { type InputHTMLAttributes } from 'react'
type InputPropsType = {
    className?: string
} & InputHTMLAttributes<HTMLInputElement>
export const CustomInput = ({   className = "", ...props} : InputPropsType) => {
  return (
        <input 
            {...props}
            className={` ring ring-transparent outline-none border-b border-blue-500 py-1 px-2 ${className}`}
        />
  )
}
