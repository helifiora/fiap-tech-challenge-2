import * as v from "valibot";

const create = v.object({
  title: v.pipe(
    v.string("'title' é obrigatório"),
    v.minLength(1, "'title' não pode ser vazio"),
    v.maxLength(255, "'title' deve ter tamanho máximo de 255 caracteres")
  ),
  content: v.pipe(
    v.string("'content' é obrigatório"),
    v.minLength(1, "'content' não pode ser vazio")
  )
});

const update = v.object({
  id: v.pipe(
    v.string("'id' é obrigatório"),
    v.uuid("'id' deve ser um uuid")
  ),
  title: v.pipe(
    v.string("'title' é obrigatório"),
    v.minLength(1, "'title' não pode ser vazio"),
    v.maxLength(255, "'title' deve ter tamanho máximo de 255 caracteres")
  ),
  content: v.pipe(
    v.string("'content' é obrigatório"),
    v.minLength(1, "'content' não pode ser vazio")
  )
});

export const postSchema = {
  update,
  create
};
