import {Rule, SchematicContext, Tree} from "@angular-devkit/schematics";

export function testcafeSchematics(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        const recorder = tree.beginUpdate('/package.json');
        return tree;
    }
}
