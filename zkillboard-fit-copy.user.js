// ==UserScript==
// @name         zKillboard FIT Extractor
// @version      1.0
// @namespace    mailto:maad@post.su
// @description  Copy EFT style FIT from zKillboard
// @author       M.Price
// @copyright    © M.Price. See the LICENSE file for license rights and limitations (MIT).
// @icon         https://raw.github.com/MihailPreis/zkillboard-fit-copy/main/icon.png
// @updateURL    https://raw.github.com/MihailPreis/zkillboard-fit-copy/main/zkillboard-fit-copyzkillboard-fit-copy.user.js
// @match        https://zkillboard.com/kill/*/
// @run-at       document-start
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    function extractFit() {
        let shipName = ""
        let result = ""
        let shipStep = false
        let children = $('#DataTables_Table_0 tbody').children().toArray()
        for (let child in children) {
            let item = $(children[child])
            let head = item.find('h5').text()
            let val = item.find('a').text().trim()

            if (head && head === "Ship") {
                shipStep = true
                continue
            }

            if (shipStep) {
                shipName = val
                break
            }

            if (head) result += "\n"
            else if (val) result += val + "\n"
        }
        GM_setClipboard(`
[${shipName}]
${result}
`)
    }

    $(document).ready(function() {
        $('a:contains("Import Fit via ESI")')
            .closest('small')
            .append('<br><a class="green extractFitButton" href="#" rel="nofollow">Copy FIT</a>')
        $(document).on('click', '.extractFitButton', extractFit)
    })
})();