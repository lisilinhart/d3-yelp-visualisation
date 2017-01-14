export default function bindAll(context, methods) {
  return methods.map(function (method) {
    context[method] = context[method].bind(context);
  });
};
