<div style="font-family: lato,arial,sans; max-width: 564px;">
<table style="border-collapse: collapse; width: 100%;" border="0">
<tbody>
<tr style="border-bottom: 1px solid #DADDE2;">
<td style="width: 100%; padding-bottom: 24px;" align="center"><span style="font-size: 24px; line-height: 36px; text-align: center;">${sysapproval.requested_for}'s request is awaiting your approval</span></td>
</tr>
<tr>
<td height="24">&nbsp;</td>
</tr>
<tr>
<td style="width: 100%; font-size: 16px; line-height: 24px;">${mail_script:request_greetings}</td>
</tr>
<tr>
<td style="width: 100%; font-size: 16px; line-height: 24px; padding-top: 16px;">${sysapproval.requested_for} recently opened request <span style="font-weight: 600;">${sysapproval}</span>, and we need your approval before we proceed.</td>
</tr>
<tr>
<td style="width: 100%; height: 52px; padding-top: 16px;"><span id="requestreject" class="btn" style="border-radius: 4px; border: 1px solid #4f52bd; padding: 6px 16px; color: #4f52bd;">${mailto:mailto.btn.rejection}</span><span id="requestapprove" class="btn inverse" style="margin-left: 16px; border-radius: 4px; border: 1px solid #4f52bd; padding: 6px 16px; background-color: #4f52bd; color: #fff;">${mailto:mailto.btn.approval}</span></td>
</tr>
</tbody>
</table>
<div style="margin-top: 16px; margin-bottom: 16px; font-size: 12pt;">${mail_script:request_item_approval}</div>
<div style="font-size: 12pt; padding-bottom: 8px; line-height: 24px;">Thank you,<br />Fulfillment Team</div>
</div>