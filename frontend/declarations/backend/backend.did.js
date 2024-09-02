export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const File = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'size' : IDL.Nat,
    'fileType' : IDL.Text,
    'category' : IDL.Text,
  });
  return IDL.Service({
    'addFile' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Vec(IDL.Nat8)],
        [Result],
        [],
      ),
    'getFileContent' : IDL.Func(
        [IDL.Nat],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        ['query'],
      ),
    'getFiles' : IDL.Func([], [IDL.Vec(File)], ['query']),
    'getFilesByCategory' : IDL.Func([IDL.Text], [IDL.Vec(File)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
