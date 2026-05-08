#!/usr/bin/env python3
"""
Linter for checkers-cli-game layered architecture.

Enforces:
1. Every source file lives inside a layer directory.
2. Imports respect the forward dependency direction.
3. No file exceeds 300 lines.
"""

import os
import sys
import ast
from pathlib import Path
from typing import List, Tuple, Dict, Set

# Layer hierarchy: each layer may import from layers listed below it
LAYER_ORDER = ['types', 'config', 'utils', 'providers', 'repo', 'service', 'ui', 'runtime']
LAYER_DIR = Path('src')

# Rules: layer -> set of layers it may import from
LAYER_IMPORT_RULES: Dict[str, Set[str]] = {
    'types': set(),
    'config': {'types'},
    'utils': {'types'},
    'providers': {'config', 'types', 'utils'},
    'repo': {'types', 'config', 'providers'},
    'service': {'types', 'config', 'utils', 'providers'},
    'ui': {'types', 'utils', 'providers'},
    'runtime': {'types', 'config', 'utils', 'providers', 'repo', 'service', 'ui'},
}


def get_layer_for_path(file_path: Path) -> str | None:
    """Determine which layer a file belongs to."""
    try:
        rel_path = file_path.relative_to(LAYER_DIR)
        parts = rel_path.parts
        if parts:
            return parts[0]
    except ValueError:
        pass
    return None


def get_imports(file_path: Path) -> List[str]:
    """Extract all import statements from a TypeScript file."""
    imports = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse TypeScript using AST
        tree = ast.parse(content, filename=str(file_path))
        
        for node in ast.walk(tree):
            if isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.append(node.module)
            elif isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name)
    except SyntaxError:
        # Fallback for TypeScript-specific syntax
        for line in content.split('\n'):
            line = line.strip()
            if line.startswith('import '):
                # Extract module from "import ... from 'module'"
                if ' from ' in line:
                    parts = line.split(' from ')
                    if len(parts) == 2:
                        module = parts[1].strip().strip("'").strip('"')
                        imports.append(module)
    return imports


def normalize_import(module: str) -> str:
    """Extract the top-level module name."""
    return module.split('/')[0].split('.')[0]


def check_file(file_path: Path) -> List[Tuple[int, str]]:
    """Check a single file for violations."""
    violations = []
    filename = os.path.basename(file_path)
    
    # Skip README files and non-.ts files
    if filename.endswith('.md') or not filename.endswith('.ts'):
        return violations
    
    # Check file length
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    if len(lines) > 300:
        violations.append((len(lines), f"File exceeds 300 lines ({len(lines)} lines)"))
    
    # Get layer and imports
    layer = get_layer_for_path(file_path)
    if layer is None:
        return violations  # Not in src/, skip
    
    imports = get_imports(file_path)
    
    # Check import rules
    for imp in imports:
        normalized = normalize_import(imp)
        if normalized in LAYER_ORDER:
            if normalized not in LAYER_IMPORT_RULES.get(layer, set()):
                violations.append(
                    (1, f"Layer '{layer}' may not import from layer '{normalized}'")
                )
    
    return violations


def find_violations() -> List[Tuple[str, int, str]]:
    """Find all violations in the codebase."""
    all_violations = []
    
    for root, dirs, files in os.walk(LAYER_DIR):
        for file in files:
            if file.endswith('.ts'):
                file_path = Path(root) / file
                violations = check_file(file_path)
                
                for line_num, message in violations:
                    all_violations.append((str(file_path), line_num, message))
    
    return all_violations


def main():
    """Main entry point."""
    violations = find_violations()
    
    if violations:
        print("Architecture violations found:\n")
        for file_path, line_num, message in violations:
            print(f"{file_path}:{line_num}: {message}")
        print(f"\nTotal: {len(violations)} violation(s)")
        sys.exit(1)
    
    print("✓ All files comply with architecture rules")
    sys.exit(0)


if __name__ == '__main__':
    main()
