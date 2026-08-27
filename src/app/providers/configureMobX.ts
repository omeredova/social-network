import { configure } from 'mobx';

export function configureMobX(){
  configure({
    enforceActions: 'always',
    computedRequiresReaction: true,
  })
}