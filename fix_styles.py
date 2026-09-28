import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8', newline='') as f:
        content = f.read()

    original_content = content

    # Specific Bug Fixes
    # 1. AppShell layout
    if filepath.endswith('AppShell.tsx'):
        content = content.replace(
            '<div className="min-h-screen bg-slate-100 dark:bg-[#070913] p-0 sm:p-4 lg:p-6 flex items-center justify-center transition-colors">',
            '<div className="h-[100dvh] w-screen bg-slate-100 dark:bg-[#070913] p-0 sm:p-4 lg:p-6 flex overflow-hidden transition-colors">'
        )
        content = content.replace(
            '<div className="w-full max-w-[1600px] min-h-screen sm:min-h-[92vh] bg-white dark:bg-[#0e1322] rounded-none sm:rounded-[32px] lg:rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-none border-0 sm:border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row transition-all relative">',
            '<div className="w-full max-w-[1600px] h-full sm:h-[92vh] mx-auto bg-white dark:bg-[#0e1322] rounded-none sm:rounded-[32px] lg:rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-none border-0 sm:border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row relative">'
        )
        content = content.replace(
            '<main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-[#0b0f1d] overflow-y-auto pb-[calc(80px+max(env(safe-area-inset-bottom,0px),16px))] lg:pb-8">',
            '<main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] dark:bg-[#0b0f1d] overflow-y-auto pb-24 lg:pb-8 relative">'
        )

    # 2. Modal Layout
    if filepath.endswith('Modal.tsx'):
        content = content.replace(
            '<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">',
            '<div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">\n      <div className="min-h-full flex items-center justify-center p-4">'
        )
        content = content.replace(
            'className={`w-full ${maxWidth} bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-150`}',
            'className={`w-full ${maxWidth} bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[100dvh] sm:max-h-[90vh] text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200 relative`}'
        )
        if 'min-h-full flex items-center justify-center p-4' in content and '      </div>\n    </div>\n  );\n};' in content:
            content = content.replace(
                '      </div>\n    </div>\n  );\n};\n',
                '      </div>\n      </div>\n    </div>\n  );\n};\n'
            )

    # 3. CourseNodeCard crash
    if filepath.endswith('CourseNodeCard.tsx'):
        content = content.replace('{course.difficulty.toFixed(1)}', '{(course.difficulty ?? 3.0).toFixed(1)}')

    # 4. Slow down transitions globally
    content = content.replace('duration-300', 'duration-500')
    content = content.replace('duration-200', 'duration-300')
    content = content.replace('duration-150', 'duration-200')

    # 5. Buttons Impeccable Monochrome styling
    colors = ['red', 'blue', 'emerald', 'indigo', 'purple', 'rose', 'amber']
    for color in colors:
        content = re.sub(
            fr'bg-{color}-600 hover:bg-{color}-[0-9]+',
            r'bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200',
            content
        )
        content = re.sub(fr'shadow-{color}-900/20', r'shadow-zinc-900/20 dark:shadow-none', content)
        content = re.sub(fr'shadow-{color}-950/20', r'shadow-zinc-900/20 dark:shadow-none', content)
        content = re.sub(fr'shadow-{color}-950/40', r'shadow-zinc-900/20 dark:shadow-none', content)
        
    content = content.replace('bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white', 'bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900')
    content = content.replace('text-white bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200', 'text-white dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200')
    content = content.replace('text-white text-xs font-bold bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200', 'text-white dark:text-zinc-900 text-xs font-bold bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200')
    content = content.replace('bg-red-600 text-white border-red-500 shadow-md', 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-md')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
