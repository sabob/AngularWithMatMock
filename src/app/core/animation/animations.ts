import {animate, state, style, transition, trigger} from '@angular/animations';

export const SlideUpDownAnimation = [
  trigger('slideUpDown', [
    state('none', style({
      transform: 'translateY(100%)'
    })),
    state('in', style({
      transform: 'translateY(100%)'
    })),
    state('out', style({
      transform: 'translateY(0)'
    })),
    transition('in => out', animate('100ms ease-in-out')),
    transition('out => in', animate('100ms ease-in-out')),
    transition('out => none', animate('100ms')),
    transition('none => out', animate('100ms ease-in-out')),
  ])
]

export const SlideInFromRightAnimation = [
  trigger('slideInFromRight', [
    state('none', style({
      transform: 'translateX(100%)'
    })),
    state('in', style({
      transform: 'translateX(100%)'
    })),
    state('out', style({
      transform: 'translate(0)'
    })),
    transition('in => out', animate('100ms ease-in-out')),
    transition('out => in', animate('100ms ease-in-out')),
    transition('out => none', animate('100ms')),
    transition('none => out', animate('100ms ease-in-out')),
  ])
]
