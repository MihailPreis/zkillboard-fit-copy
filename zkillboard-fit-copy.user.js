// ==UserScript==
// @name         zKillboard FIT Extractor
// @version      1.1
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
        let cargoStep = false
        let children = $('#DataTables_Table_0 tbody').children().toArray()
        for (let child in children) {
            let item = $(children[child])
            let head = item.find('h5').text()
            let val = item.find('a').text().trim()
            let count = item.find('.item_dropped[style="text-align: right;"]').text() || item.find('.item_destroyed[style="text-align: right;"]').text()
            count = parseInt(count.replace(/,/g, ''))

            if (head && head === "Ship") {
                shipStep = true
                continue
            } else if (head && head === "Cargo") {
                cargoStep = true
                continue
            }

            if (shipStep) {
                shipName = val
                break
            }

            if (head) result += "\n"
            else if (val) {
                if (cargoStep) {
                    result += `${val} x${count || 1}\n`
                } else {
                    if (count) {
                        if (count > 10) {
                            result += `${val} x${count || 1}\n`
                        } else {
                            result += `${val}\n`.repeat(count)
                        }
                    } else {
                        result += `${val}\n`
                    }
                }
            }
        }
        try {
            GM_setClipboard(`[${shipName}]\n${result}`)
            alert('FIT was copied!')
        } catch (err) {
            console.error(err)
        }
        return false
    }

    $(document).ready(function() {
        $('a:contains("Import Fit via ESI")')
            .closest('small')
            .append('<br><a class="green extractFitButton" href="#" rel="nofollow">Copy FIT</a>')
        $(document).on('click', '.extractFitButton', extractFit)
    })
})();