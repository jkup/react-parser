const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function parseFile(filePath) {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const ast = parse(fileContents, { sourceType: "module", plugins: ["jsx"] });

  const components = {};

  traverse(ast, {
    ExportNamedDeclaration({ node }) {
      if (node.declaration && node.declaration.type === "FunctionDeclaration") {
        const componentName = node.declaration.id.name;
        components[componentName] = parseReactComponent(node.declaration);
      }
    },
  });

  return components;
}

function parseReactComponent(component) {
  const ast = {
    type: component.id.name,
    props: {},
    children: [],
  };

  // parse props
  if (component.params && component.params.length > 0) {
    const propsParam = component.params[0];

    if (propsParam.type === "ObjectPattern") {
      propsParam.properties.forEach((prop) => {
        if (prop.value.type === "ObjectPattern") {
          ast.props[prop.key.name] = parseReactComponent(prop.value);
        } else {
          ast.props[prop.key.name] = prop.value.name;
        }
      });
    }
  }

  // parse children
  if (component.body && component.body.type === "BlockStatement") {
    component.body.body.forEach((statement) => {
      if (statement.type === "ReturnStatement" && statement.argument) {
        if (Array.isArray(statement.argument)) {
          ast.children = statement.argument.map((child) =>
            parseReactComponent(child)
          );
        } else {
          ast.children.push(parseReactComponent(statement.argument));
        }
      }
    });
  }

  return ast;
}

const filePath = path.join(__dirname, "index.tsx");
const components = parseFile(filePath);

console.log(components);
