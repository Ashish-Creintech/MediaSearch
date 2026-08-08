// media-ui-react never imports media-core's types — that would couple a
// "pure UI" package to the SDK's shape. Instead these components are generic
// over T: give them any object with an `id`, and they don't care where it
// came from.

export interface WithId {
  id: string | number;
}
