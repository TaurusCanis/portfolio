
export default function QuestionText({ text, section }) {
    return (
        <span dangerouslySetInnerHTML={{__html: text}}></span>
    );
}