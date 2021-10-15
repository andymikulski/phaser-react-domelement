import ReactDOM from "react-dom";
import Phaser from 'phaser';
import React from "react";

// Tell TypeScript and Phaser to allow `scene.add.react`
/* eslint-disable */
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      react(x:number, y:number, component:React.FC, props?:object): PhaserReactDOMElement;
    }
  }
}
/* eslint-enable */
Phaser.GameObjects.GameObjectFactory.register(
  "react",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    // These params should probably match `PhaserReactDOMElement`'s constructor params
    x:number,
    y:number,
    component:React.FC,
    props:object = {}
  ) {
    const element = new PhaserReactDOMElement(this.scene, x, y, component, props);
    this.displayList.add(element);
    this.updateList.add(element);
    return element;
  },
);

// --

export default class PhaserReactDOMElement extends Phaser.GameObjects.DOMElement {
  constructor(
    scene:Phaser.Scene,
    public x:number,
    public y:number,
    public component:React.ComponentType,
    public readonly props = {}
  ) {
    super(scene, x, y, 'aside');
    this.render(this.props);
  }

  private render = (props:object = {}) => {
    const ChildComponent = this.component;
    // The real magic - React takes care of updating any existing components for us.
    ReactDOM.render(<ChildComponent {...props} />, this.node);
  }

  public expandToFullDimensions = () => {
    (this.node as HTMLElement).style.width = '100%';
    (this.node as HTMLElement).style.height = '100%';
  }

  /**
   * Updates the props for the React component and triggers a render.
   */
  public setProps = (props:any = {}) => {
    // Mark 'as any' to override the readonly attribute
    (this.props as any) = {
      ...this.props,
      ...props,
    };


    this.render(this.props);

    return this;
  }

  /**
   * @deprecated This is a React element - use setProps instead.
   */
  public setHTML = (_html:string) => {
    /**
     * Forbid the `DOMElement.setHTML` function from firing and tell the dev to use props instead.
     * This prevents issues where a React component could mount but then be wiped out with setHTML.
     */
    throw new Error("You can't use setHTML with a React-based element. Use setProps instead.");
  }

  // Clean up DOM
  public destroy = (fromScene?: boolean) => {
    // Unmount the React component
    ReactDOM.unmountComponentAtNode(this.node);
    super.destroy(fromScene);
  }
}