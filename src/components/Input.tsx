import { h } from "preact";

interface InputPropsTypes {
  placeholder?: string;
  label: string;
  name: string;
  class?: string;
  type?: string;
  value?: string;
}
export default function Input({ label, placeholder, name, value, class: className, type = "text" }: InputPropsTypes) {
  return (
    <div class={className}>
      <label for={name} class="block text-sm font-medium text-gray-700 text-light-blue-dark dark:text-dark-blue-light">{label}</label>
      <div class="relative mt-1 rounded-md shadow-sm">
        <input type={type} name={name} id={name} value={value} class="block w-full rounded-md border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder={placeholder} />
      </div>
    </div>
  )
}
