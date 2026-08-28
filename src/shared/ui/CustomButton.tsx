import { type ButtonHTMLAttributes, type PropsWithChildren } from 'react'
export type CustomButtonPropsType = {
    isSelected: boolean,
    className?: string,
} & ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren
export const CustomButton = ({ children, isSelected, className = "", ...props } : CustomButtonPropsType ) => {
  return (
    <button
        className={`font-semibold text-start text-gray-900 hover:border-indigo-400 border border-transparent transition-all duration-200  ring-2 p-1 px-4 cursor-pointer ${className}
        ${ isSelected ? 'rounded-xl ring-indigo-500 text-indigo-500 ' : 'ring-transparent' }`}
        {...props}
    >
        {children}
    </button>
  )
}
