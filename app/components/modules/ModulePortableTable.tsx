import { useEffect } from "react";
import PortableText from "../portableText/PortableText";
import clsx from "clsx";

interface Props {
    columns: number;
    body1: any;
    body2: any;
    body3?: any;
    body4?: any;
    body5?: any;
    body6?: any;
    body7?: any;
    body8?: any;
    noPadding?: boolean
}

export default function ModulePortableTable(props: Props) {
    const { columns, body1, body2, body3, body4, body5, body6, body7, body8, noPadding } = props;

    useEffect(() => {
        const updateColumnWidth = () => {
            const cells = document.querySelectorAll<HTMLElement>(".portableTable-cell-1");
            
            let maxWidth = 0;

            // Reset widths to auto before measuring (important for shrink behavior)
            cells.forEach(cell => {
                cell.style.width = "auto";
            });

            // Get the max inner content width
            cells.forEach(cell => {
                const contentWidth = cell.scrollWidth; // Measures inner content width
                if (contentWidth > maxWidth) {
                    maxWidth = contentWidth;
                }
            });

            // Apply the max width to all
            cells.forEach(cell => {
                cell.style.width = `${maxWidth}px`;
            });
        };

        // Use ResizeObserver for better real-time resizing support
        const observer = new ResizeObserver(updateColumnWidth);
        document.querySelectorAll(".portableTable").forEach((table) => observer.observe(table));

        // Initial call
        updateColumnWidth();

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={clsx("portableTable flex flex-col md:flex-row md:gap-[2em] pb-[2em]", !noPadding? "pb-[2em] md:pb-[1em]": " md:pb-0")}>
            <div className={clsx("portableTable-cell-1 whitespace-nowrap mb-[.5em]", !noPadding ? " ": "md:mb-0")}><PortableText blocks={body1} /></div>
            <div className="portableTable-cell-2"><PortableText blocks={body2} /></div>
            {body3 && <div className="portableTable-cell-3"><PortableText blocks={body3} /></div>}
            {body4 && <div className="portableTable-cell-4"><PortableText blocks={body4} /></div>}
            {body5 && <div className="portableTable-cell-5"><PortableText blocks={body5} /></div>}
            {body6 && <div className="portableTable-cell-6"><PortableText blocks={body6} /></div>}
            {body7 && <div className="portableTable-cell-7"><PortableText blocks={body7} /></div>}
            {body8 && <div className="portableTable-cell-8"><PortableText blocks={body8} /></div>}
        </div>
    );
}
