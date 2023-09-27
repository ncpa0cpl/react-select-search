import { SelectSearch } from "../src";
import "../style.css";
import { fontStacks, friends } from "./data";

export default {
  title: "Custom",
};

function renderFontValue(valueProps, snapshot, className) {
  const { option } = snapshot;
  const style = {
    fontFamily:
      !snapshot.focus && option && "stack" in option ? option.stack : null,
  };

  return <input {...valueProps} className={className} style={style} />;
}

function renderFontOption(props, { stack, name }, snapshot, className) {
  return (
    <button {...props} className={className} type="button">
      <span style={{ fontFamily: stack }}>{name}</span>
    </button>
  );
}

function renderFriend(props, option, snapshot, className) {
  const imgStyle = {
    borderRadius: "50%",
    verticalAlign: "middle",
    marginRight: 10,
  };

  return (
    <button {...props} className={className} type="button">
      <span>
        <img
          alt=""
          style={imgStyle}
          width="28"
          height="28"
          src={option.photo}
        />
        <span>{option.name}</span>
      </span>
    </button>
  );
}

export const FontExample = () => (
  <SelectSearch
    options={fontStacks}
    renderValue={renderFontValue}
    renderOption={renderFontOption}
    renderGroupHeader={(str) => <strong>{str}</strong>}
    search
    defaultValue="Monoton"
  />
);

export const AvatarExample = () => (
  <SelectSearch
    options={friends}
    renderOption={renderFriend}
    multiple
    search
    placeholder="Search friends"
  />
);

export const CSSModules = () => (
  <SelectSearch
    className={"custom-class-name"}
    multiple
    options={[
      { value: "hamburger", name: "Hamburger" },
      { value: "fries", name: "Fries" },
      { value: "milkshake", name: "Milkshake" },
    ]}
  />
);
