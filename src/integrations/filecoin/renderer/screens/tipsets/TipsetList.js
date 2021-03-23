import React, { Component } from "react";
import connect from "../../../../../renderer/screens/helpers/connect";
import * as Tipsets from "../../../common/redux/tipsets/actions";

import MiniTipsetCard from "./MiniTipsetCard";

class TipsetList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    // If the scroll position changed...
    const latestRequested = prevProps.tipsets.requested[prevProps.core.latestTipset];
    const earliestRequested = prevProps.tipsets.requested[0];
    if (
      prevProps.appshell.scrollPosition != this.props.appshell.scrollPosition
    ) {
      if (prevProps.appshell.scrollPosition == "top" && !latestRequested) {
        this.props.dispatch(Tipsets.requestPreviousPage());
      } else if (
        prevProps.appshell.scrollPosition == "bottom" &&
        !earliestRequested
      ) {
        this.props.dispatch(Tipsets.requestNextPage());
      }
      return;
    }

    // No change in scroll position? If a new block has been added,
    // request the previous page
    if (prevProps.tipsets.inView.length == 0) {
      return;
    }

    const latestTipsetInView = prevProps.tipsets.inView[0].Height;
    if (
      prevProps.appshell.scrollPosition == "top" &&
      prevProps.core.latestTipset > latestTipsetInView &&
      !latestRequested
    ) {
      this.props.dispatch(Tipsets.requestPreviousPage());
    }
  }

  render() {
    return (
      <div className="TipsetList">
        {this.props.tipsets.inView.map(tipset => {
          return (
            <MiniTipsetCard
              key={`tipset-${tipset.Height}`}
              tipset={tipset}
              gasUsed={this.props.tipsets.inViewGasUsed[tipset.Height]}
              messageCount={this.props.tipsets.inViewMessageCounts[tipset.Height]}
            />
          );
        })}
      </div>
    );
  }
}

export default connect(
  TipsetList,
  ["filecoin.core", "core"],
  ["filecoin.tipsets", "tipsets"],
  "appshell",
);