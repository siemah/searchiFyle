import { useRef } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import Input from "./Input";

type OnSearchInsideFileParamsTypes = {
  separator: string;
  regexp: RegExp;
  file: {
    type: string;
    extension: string;
  }
};
export default function Form() {
  const linkRef = useRef<HTMLAnchorElement>(null!);
  const escapeRegExp = (stringToGoIntoTheRegex) => {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  const onSearchInsideFile = ({ regexp, separator, file }: OnSearchInsideFileParamsTypes) => (event: ProgressEvent<FileReader>) => {
    const content = event.target.result;

    if (event.target.readyState === event.target.DONE) {
      const result = `${content}`.match(regexp);
      const outputContent = result?.join(`\n${separator || ""}\n`);
      const blob = new Blob([outputContent], { type: file.type });
      linkRef.current.download = `searchiFyle-output.${file.extension}`;
      linkRef.current.href = URL.createObjectURL(blob);
      linkRef.current.click();
      const timer = setTimeout(() => {
        URL.revokeObjectURL(linkRef.current.href);
        clearTimeout(timer);
      }, 2000);
    }
  };
  const getFileExtension = (file: File) => {
    const fileName = file?.name;
    const pointLastIndex = fileName?.lastIndexOf(".");
    const extension = fileName.substring(pointLastIndex + 1);
    return extension;
  }
  const onSubmit: JSXInternal.GenericEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const htmlForm = event.currentTarget;
    const { files = [] } = htmlForm.file;
    const { start, middle, end, separator } = htmlForm;
    const pattern = `(${start.value}.*[\\n|\\w|\\s]*${middle.value}[\\n|\\w|\\s]*${end.value})`;
    const regexp = new RegExp(pattern, 'gi');
    const reader = new FileReader();
    const file = files?.[0];
    const extension = getFileExtension(file);
    const config = {
      regexp,
      separator: separator.value,
      file: {
        type: file.type,
        extension
      }
    };
    reader.addEventListener("load", onSearchInsideFile(config));
    reader.readAsText(file, "utf-8");
    reader.removeEventListener("load", onSearchInsideFile(config));
  }

  return (
    <form onSubmit={onSubmit}>

      <Input label="Debut" name="start" placeholder={"Word/start"} class={"mb-4"} />
      <Input label="Mot" name="middle" placeholder={"Word/middle"} class={"mb-4"} />
      <Input label="Fin" name="end" placeholder={"Word/end"} class={"mb-4"} />
      <Input label="Separateur des resultas" name="separator" value={"--------"} class={"mb-4"} />
      <Input label="Fichier" name="file" placeholder={"Fichier"} class={"mb-4"} type={"file"} />

      <button
        type={"submit"}
        class="text-light-blue-light hover:text-light-blue-dark dark:text-gray-400 bg-light-secondary shadow-button-flat-nopressed hover:border-2 hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:border-2 active:shadow-button-flat-pressed font-medium rounded-md text-sm p-2.5 text-center inline-flex items-center mr-4 last-of-type:mr-0 border-2 border-transparent dark:bg-button-curved-default-dark dark:shadow-button-curved-default-dark dark:hover:bg-button-curved-pressed-dark dark:hover:shadow-button-curved-pressed-dark dark:focus:bg-button-curved-pressed-dark dark:focus:shadow-button-curved-pressed-dark dark:border-0"
      >
        Rechercher et generer
      </button>

      <a ref={linkRef} download={"output.txt"} />

    </form>
  )
}
