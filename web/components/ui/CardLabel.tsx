import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  leftHeader?: React.ReactNode;
  rightAction?: React.ReactNode;
  isDisconnect?: boolean;
}

const CardLabel = ({
  leftHeader,
  rightAction,
  isDisconnect,
  ...rest
}: Props) => {
  return (
    <div className="card-label-container" {...rest}>
      <div className="card-label">{leftHeader}</div>

      {rightAction ? (
        <div
          className={`card-label ${
            isDisconnect ? "disconnect-button" : "action-button"
          }`}
        >
          {rightAction}
        </div>
      ) : null}
    </div>
  );
};

export default CardLabel;
