import { InformationCircleIcon } from "@heroicons/react/20/solid";

export default function ToolTip({ info }:{ info: string }) {
  return (
    <>
      <a href="#" className="group absolute duration-300 invisible lg:visible">
        <InformationCircleIcon className="h-4 w-4 text-gray-300 hover:text-gray-500" aria-hidden="true" />

        <span className="absolute hidden group-hover:flex -left-24 -top-2 -translate-y-full w-52 px-2 py-2 bg-gray-700 rounded-lg text-center text-white text-xs after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
          {info}
        </span>
      </a>
    </>
  )
}
