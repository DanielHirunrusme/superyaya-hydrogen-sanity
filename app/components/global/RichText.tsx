
interface RichTextProps {
  className?: string
  data: string
}

export function RichText({ className, data }: RichTextProps) {
  return (
    <div>
      {data.split('\n').map((line, index) => {
        if (line.trim() === '') {
          return <br key={index} />; // Add a line break for empty lines
        }
        return <p key={index}>{line}</p>; // Wrap non-empty lines in <p> tags
      })}
    </div>
  );
}
