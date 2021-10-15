import Phaser from 'phaser';
import React, { useEffect, useState } from 'react';
import PhaserReactDOMElement from './PhaserReactDOMElement';

export default class MainScene extends Phaser.Scene {
  private myReactThing: PhaserReactDOMElement;

  preload = () => {
    this.load.image('mario', 'https://i.imgur.com/nKgMvuj.png');
    this.load.image('background', 'https://i.imgur.com/dzpw15B.jpg');
  };
  create = () => {
    this.add.text(0,0,'Phaser React DOMElement test', {color: '#fff', fontSize: '16px'});

    const mario = this.add.image(512, 256, 'mario').setDisplaySize(64, 64);

    this.add.image(0, 0, 'background')
      .setOrigin(0, 0) // Anchor to top left so (0,0) is flush against the corner
      .setDisplaySize(1024, 768) // Fit background image to window
      .setDepth(-1); // Behind everything


    this.add.react(128, 128, MyMenu, {
      onMenuToggle: () => {
        console.log('hello from react!');
        mario.setTint(Math.random() * 0xffffff);
      }
    } as MenuProps);


    const otherThing = this.add.dom(512, 128, 'aside', 'background: #000; color: #fff; user-select: none; cursor: pointer', `click here to change the 'name' prop`);
    otherThing.addListener('click').on('click', () => {
      const randomName = [
        'Helga',
        'Arnold',
        'Gerald',
        'Steely Phil',
        'Eugene',
        'Phoebe',
        'Rhonda',
        'Lila'
      ].sort(()=>Math.random() > 0.5 ? 1 : -1).sort(()=>Math.random() > 0.5 ? 1 : -1)[0];

      this.myReactThing.setProps({
        name: randomName
      });
    })
  };

  update = (time: number, delta: number) => {
    this.myReactThing.x = 100 + (Math.cos(time * 0.001) * 50);
    this.myReactThing.y = 100 + (Math.sin(time * 0.001) * 50);
  }
}

const getDots = (num:number) => {
  return Array(Math.ceil(num)).fill('■').join('');
}


type MenuProps = {
  onMenuToggle: () => void;
  name?: string;
}
const MyMenu:React.FC<MenuProps> = (props = {
  onMenuToggle: () => {}
}) => {
  const [isOpen, setOpenState] = useState(false);
  const [wasPressed, setButtonPressed] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setTimeout(() => {
      setCount(count + 1);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <>
      <button onClick={()=>{
        setOpenState(!isOpen)
        props.onMenuToggle();
      }}>Hello {props.name || ''}</button>
      {
        isOpen &&
        <>
          <div style={{background: '#fff', borderRadius: 16, padding: '2em'}}>
            <ol style={{padding:0, margin:0}}>
              <li>This is all React!</li>
              <li>{count} {getDots( Math.abs(Math.sin(0.2 * (count + (Math.PI / 4) * 1)) * 5)) }</li>
              <li>{count + 1} {getDots( Math.abs(Math.sin(0.2 * (count + (Math.PI / 4) * 2)) * 5)) }</li>
              <li>{count + 2} {getDots( Math.abs(Math.sin(0.2 * (count + (Math.PI / 4) * 3)) * 5)) }</li>
            </ol>
          </div>


          <button onClick={()=>setButtonPressed(!wasPressed)}>Press the button!</button>
          {
            wasPressed && <div>The button was pressed!</div>
          }
        </>
      }
    </>
  );
}