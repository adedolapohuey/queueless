import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

export function renderTemplate(
  templateName: string,
  variables: Record<string, any>
) {
  const templatePath = path.join(__dirname, `./${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const compiled = Handlebars.compile(templateSource);
  return compiled(variables);
}
