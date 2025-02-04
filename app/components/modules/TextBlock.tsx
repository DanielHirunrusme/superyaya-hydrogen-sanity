import clsx from "clsx";
import PortableText from "../portableText/PortableText";


interface ModuleTextBlockProps {
    title: string;
    body: any
    noPadding?: boolean
}

export default function ModuleTextBlock(props: ModuleTextBlockProps) {
    console.log(props)
    const { title, body, noPadding } = props;
    return (
        <div className={clsx("mx-auto", !noPadding ? 'mb-[1em]' : 'mb-0' )}>
            <h2 className="mb-[.5em]">{title}</h2>
            <PortableText blocks={body} />
        </div>
    );
}
