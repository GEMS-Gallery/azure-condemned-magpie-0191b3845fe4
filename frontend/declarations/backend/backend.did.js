export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const File = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'size' : IDL.Opt(IDL.Text),
    'fileType' : IDL.Text,
    'category' : IDL.Text,
  });
  return IDL.Service({
    'addFile' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Text), IDL.Text],
        [Result],
        [],
      ),
    'getFiles' : IDL.Func([], [IDL.Vec(File)], ['query']),
    'getFilesByCategory' : IDL.Func([IDL.Text], [IDL.Vec(File)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
