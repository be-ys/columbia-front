export const contextParser = {
    methods: {
        contextParser(contexts) {
            contexts.forEach(e => {
                let count = 0;
                e.baseName=e.name;
                e.parentList = [];
                if (e.parentContext) {
                    let pc = e.parentContext;
                    while (pc) {
                        count+=1;
                        e.name = pc.name.concat(" > ").concat(e.name);
                        e.parentList.push(pc.id);
                        pc = pc.parentContext;
                    }
                }
                e.level=count;
                e.isParent=false;
                contexts.forEach(f => {
                    if(f.parentContext && f.parentContext.id===e.id){
                        e.isParent=true;
                    }
                });
            });
            contexts.sort(function (a, b) {
                return a.name.localeCompare(b.name)
            });

            return contexts;
        }
    }
}