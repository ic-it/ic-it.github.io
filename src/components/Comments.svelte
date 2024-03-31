<script lang="ts">
/* Generate Giscus from
 * https://giscus.app/
 * yppu only need to change the following fields:
 * dataset.repo="XXX"
 * dataset.repoId="XXX"
 * dataset.category="XXX"
 * dataset.categoryId="XXX"
 **/

const loadTheme = () => {
    let giscusTheme = localStorage.getItem("theme");
    giscusTheme = (giscusTheme == 'light')? 'light' : 'dark';
    return giscusTheme; 
}

</script>

<div>
<script src="https://giscus.app/client.js"
        data-repo="ic-it/ic-it.github.io"
        data-repo-id="MDEwOlJlcG9zaXRvcnkxOTkxNTY4ODA="
        data-category="General"
        data-category-id="DIC_kwDOC97kkM4CeXSl"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="{loadTheme()}"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
</div>