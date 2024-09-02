export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getValue' : IDL.Func([], [IDL.Text], ['query']),
    'setValue' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
