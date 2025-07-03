import badMood from "../../assets/icons/mood/1bad.png";
import sadMood from "../../assets/icons/mood/2sad.png";
import neutralMood from "../../assets/icons/mood/3neutral.png";
import happyMood from "../../assets/icons/mood/4happy.png";
import veryHappyMood from "../../assets/icons/mood/5veryhappy.png";
import noCommentMood from "../../assets/icons/mood/0no-comment.png";
import Dropdown from "../UI/dropdown";

const moodIcons: Record<MoodType, string> = {
  "0nocomment": noCommentMood,
  "1bad": badMood,
  "2sad": sadMood,
  "3neutral": neutralMood,
  "4happy": happyMood,
  "5veryhappy": veryHappyMood,
};

export type MoodType =
  | "0nocomment"
  | "1bad"
  | "2sad"
  | "3neutral"
  | "4happy"
  | "5veryhappy";

interface MoodDropdownProps {
  value: MoodType;
  onChange: (value: MoodType) => void;
}

const DropdownMood: React.FC<MoodDropdownProps> = ({ value, onChange }) => {
  const options: MoodType[] = Object.keys(moodIcons) as MoodType[];

  return (
    <Dropdown<MoodType>
      value={value}
      options={options}
      onChange={onChange}
      renderSelected={(mood) => (
        <img src={moodIcons[mood]} alt={mood} width="30" height="30" />
      )}
      renderOption={(mood) => (
        <img src={moodIcons[mood]} alt={mood} width="30" height="30" />
      )}
    />
  );
};

export default DropdownMood;
