import { configure } from 'mobx';

export const configureMobX = () => {
  configure({
    enforceActions: 'always',
    computedRequiresReaction: true,
  })
}