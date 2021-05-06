import Assigner, { AssignerEnv } from 'src/kernel/Assigner';

test('assigner working', () => {
  let env = new AssignerEnv();
  env.setJobReq(1, 2, [2, 3, 4]);
  env.setJobReq(2, 3, [1, 2, 3, 4, 5, 6]);
  let a = new Assigner(env);
  let ans = a.getHeuristicAssignment();
  for (let [j, eSet] of ans) {
    console.log(j, eSet);
  }
});
