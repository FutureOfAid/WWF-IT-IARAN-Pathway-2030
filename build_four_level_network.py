import json
from pathlib import Path


def n(id, label, type, source, **extra):
    item = {"id": id, "label": label, "type": type, "source": source}
    item.update(extra)
    return item


goals = [
    ("G1", "Zero perdita di habitat naturali e specie"),
    ("G2", "Dimezzare l’impronta umana sulla natura"),
    ("G3", "Riportare la natura al centro dei valori"),
]

objectives = [
    ("O1", "G1", "Potenziare la protezione e il restauro di habitat"),
    ("O2", "G1", "Rafforzare la protezione e il ripristino di specie chiave"),
    ("O3", "G2", "Trasformare i modelli di produzione e consumo"),
    ("O4", "G2", "Promuovere la transizione per contrastare il cambiamento climatico"),
    ("O5", "G3", "Impegnare il sistema istituzionale nella tutela della natura"),
    ("O6", "G3", "Integrare la natura in tutti gli ambiti educativi e formativi"),
]

results = [
    ("R1.1", "O1", "Incrementata l’estensione delle aree protette terrestri e marine"),
    ("R1.2", "O1", "Restaurati habitat degradati"),
    ("R1.3", "O1", "Diffusa adozione modelli di gestione condivisa e sostenibile del territorio"),
    ("R1.4", "O1", "Facilitata transizione a blue economy sostenibile dello spazio marittimo"),
    ("R2.1", "O2", "Favorita conservazione e gestione sostenibile di specie chiave"),
    ("R2.2", "O2", "Proseguito il rewilding di specie chiave"),
    ("R2.3", "O2", "Potenziato il contrasto ai crimini di natura"),
    ("R2.4", "O2", "Promossa coesistenza virtuosa tra uomo e specie"),
    ("R3.1", "O3", "Intensificata la diffusione dell’agroecologia"),
    ("R3.2", "O3", "Aumentata l’adozione di stili di vita responsabili, con focus su dieta sana e sostenibile"),
    ("R3.3", "O3", "Favorita la transizione verso l’economia circolare in settori ad alta intensità di risorse"),
    ("R4.1", "O4", "Ridotte emissioni climalteranti"),
    ("R4.2", "O4", "Messe in campo azioni e buone pratiche per l’adattamento in ambito urbano"),
    ("R4.3", "O4", "Promossa l’attivazione tangibile dei cittadini per la riduzione dell’uso dei combustibili fossili in favore di fonti rinnovabili"),
    ("R5.a", "O5", "Potenziato il contrasto alle politiche dannose per l’ambiente"),
    ("R5.b", "O5", "Attuata la riforma costituzionale, rafforzando la normativa a favore di natura, biodiversità e transizione"),
    ("R5.c", "O5", "Consolidate alleanze e attivazioni per promuovere comunicazione, sensibilizzazione e advocacy"),
    ("R6.a", "O6", "Offerti strumenti e percorsi educativi e formativi per gruppi target strategici"),
    ("R6.b", "O6", "Resi i cittadini agenti di cambiamento e autori di azioni di integrità ambientale"),
    ("R6.c", "O6", "Diffusa informazione sulla interconnessione tra natura e persone"),
]

# Level 4 activities: first row / first square layer immediately under the result oval,
# following the method clarified by Michel on 15 May 2026.
level4_activities = {
    "R1.1": [
        "MIT adotta un piano MSP che include le aree per il 30x30",
        "Comuni accettano di entrare nel sistema",
        "AMP ricevono più fondi per gestire e conservare le aree",
        "Proprietari privati aderiscono al nuovo sistema (OECM)",
        "Fondazioni inseriscono il sistema nelle loro strategie",
    ],
    "R1.2": [
        "Gestori e proprietari attuano piani di ripristino del territorio",
        "Soggetti attuatori aumentano attività di restoration",
    ],
    "R1.3": [
        "Enti gestori coinvolgono operatori del territorio e comunità locale",
        "Attori economici del territorio adottano pratiche sostenibili nei rispettivi ambienti",
        "Istituzioni nazionali e regionali formalizzano modelli di co-gestione",
    ],
    "R1.4": [
        "Ministeri adottano un piano di gestione dello spazio marittimo con approccio ecosistemico",
        "Regioni definiscono normative locali a supporto della blue economy sostenibile",
        "Settore produttivo adotta processo di trasformazione volontaria dei modelli produttivi",
        "Banche finanziano progetti in linea con la blue economy sostenibile",
        "Fondazioni finanziano progetti in linea con la blue economy sostenibile",
    ],
    "R2.1": [
        "Ministero, Regioni e Parlamento definiscono strategie efficaci per la gestione di specie chiave",
        "Agenzie autorizzate incrementano l’offerta di supporto tecnico e operativo alle specie chiave",
        "Pubblica Amministrazione aumenta la gestione e conservazione della specie",
        "Pubblica Amministrazione investe nella gestione e conservazione della specie",
        "Parchi e normative migliorano il supporto alla gestione di specie chiave",
    ],
    "R2.2": [
        "Enti e istituzioni competenti finanziano i progetti di rewilding",
        "Comunità locali accettano le azioni di rewilding",
        "ONG accedono a maggiori finanziamenti",
    ],
    "R2.3": [
        "Forze dell’ordine effettuano più controlli",
        "Magistratura applica in maniera più rigorosa le leggi in materia di crimini di natura",
        "Comunità locali contribuiscono al contrasto dei crimini",
    ],
    "R2.4": [
        "Associazioni di categoria adottano strumenti e pratiche funzionali alla coesistenza virtuosa",
        "Ministeri implementano piani di azione per la convivenza e allocano le necessarie risorse",
        "Regioni attivano strumenti finanziari e normativi funzionali alla coesistenza e alla mitigazione dei conflitti",
        "Comunità locali adottano comportamenti preventivi al conflitto con specie",
    ],
    "R3.1": [
        "EU attua il Green Deal per l’agricoltura, riforma PAC e regolamenti tematici",
        "Agricoltori applicano metodi agroecologici",
        "Consumatori incrementano consumi di agricoltura biologica",
    ],
    "R3.2": [
        "Scuole educano le generazioni sui benefici di uno stile di vita sano e sull’impatto ambientale",
        "Aziende rivenditori selezionano prodotti sani e a basso impatto ambientale",
        "Consumatori scelgono alimenti sani e a basso impatto ambientale",
        "Consumatori scelgono prodotti a basso impatto ambientale",
        "Organi legislativi ed esecutivi adottano i principi di riduzione dell’impatto ambientale",
    ],
    "R3.3": [
        "Parlamento e governo introducono nuove norme per incentivare economia circolare e implementare norme",
        "Comuni e associazioni incentivano e partecipano all’adozione di politiche di economia circolare",
        "Aziende aumentano la circolarità dei processi produttivi",
        "Consumatori incrementano la quota di acquisto di prodotti sostenibili e modificano stile di vita",
        "Corti UE condannano green washing",
    ],
    "R4.1": [
        "Parlamento adotta legge sul clima",
        "Aziende produttrici di energia diventano 100% rinnovabili",
        "Governo destina fondi social climate fund ad attività coerenti con la giusta transizione",
        "Agricoltura e zootecnia riducono produzione da allevamenti intensivi",
    ],
    "R4.2": [
        "Ministero della Salute promuove adeguate linee guida di prevenzione degli effetti del cambiamento climatico",
        "Ministero Ambiente obbliga a inserire nella pianificazione urbana criteri di adattamento al cambiamento climatico",
        "Ministero Ambiente istituisce l’osservatorio su adattamento al cambiamento climatico",
        "Comuni e Regioni adottano e attuano il piano di adattamento al cambiamento climatico",
    ],
    "R4.3": [
        "Comunità di cittadini adotta e promuove uso di energie rinnovabili e azzeramento combustibili fossili",
        "Istituti scolastici sensibilizzano i cittadini a comportamenti responsabili",
        "UE rafforza gli strumenti partecipativi rendendoli più vincolanti e promuove meccanismi incentivanti",
    ],
    # Objective-level maps only: these are allocated cautiously to official results.
    "R5.a": [
        "Istituzioni attuano politiche ambientali efficaci",
        "Istituzioni e partiti politici agiscono in coerenza con gli obiettivi di Our Values",
        "Associazioni ambientaliste, ETS, aziende e mondo cattolico fanno lobby",
    ],
    "R5.b": [
        "La commissione conferma il Green Deal negli aspetti essenziali",
        "Fondi EU e fondi strutturali e coesione sociale maggiormente orientati alla sostenibilità",
    ],
    "R5.c": [
        "Cittadini aderiscono e promuovono un modello di sviluppo sostenibile",
        "Aziende agiscono sostenibilmente e in coerenza con gli obiettivi di Our Values",
        "Media generalisti contribuiscono a rendere mainstream il pensiero ambientalista sostenibile",
        "Associazioni Ambientaliste ed ETS sviluppano partnership di corporate engagement sulla sostenibilità",
    ],
    "R6.a": [
        "Istituti scolastici offrono sempre più percorsi educativi coerenti con Our Values",
        "Università e centri di ricerca aumentano qualità e quantità dei corsi Our Values in corsi e master",
        "Ordini professionali organizzano corsi di aggiornamento coerenti con Our Values",
    ],
    "R6.b": [
        "Cittadini contribuiscono a migliorare il rapporto fra uomo e natura con accresciuta conoscenza e consapevolezza",
        "Comunità e amministrazioni locali richiedono spazi e servizi green",
        "Associazioni ambientaliste valorizzano e incrementano l’offerta di natura alla cittadinanza",
    ],
    "R6.c": [
        "Piattaforme e altri canali diffondono contenuti coerenti con Our Values",
        "Società di produzione e fondi di finanziamento pubblici e privati orientano contenuti coerenti con Our Values",
        "Opinion leader veicolano contenuti coerenti con Our Values",
    ],
}

level5 = {
    "R1.1": [
        "MASE riconosce e istituisce nuove aree AAPP/AMP",
        "Stato e Regioni raggiungono l’accordo per l’istituzione delle nuove aree protette",
        "Parlamento rafforza la governance delle AAPP",
        "Stato e Regioni adottano misure fiscali di vantaggio per le aree protette",
        "ONG fanno pressione sulle associazioni di categoria con benefici NBS",
        "Fondazioni e banche investono su PES, microcrediti e investimenti green",
        "PAC incentiva le misure green su aree protette",
        "ONG assicurano l’implementazione dei criteri OECM per entrare nel sistema",
    ],
    "R1.2": [
        "MASE definisce il piano nazionale di ripristino entro il 2026",
        "Ministeri finanziano interventi del piano nazionale",
        "Regioni finanziano interventi",
        "Aziende e fondazioni destinano fondi a restoration",
        "ONG e agenzie forestali definiscono programmi di intervento locali",
        "Università/ISPRA supporta identificazione ecosistemi prioritari",
        "ONG fanno lobby e sensibilizzazione su importanza nature restoration",
        "Investitori riconoscono il valore di ecosistemi restaurati",
    ],
    "R1.3": [
        "Istituzioni stanziano risorse per implementazione modelli",
        "ONG e enti si attivano per sviluppare competenze sui modelli",
        "Attori economici partecipano a livelli aggregata",
        "Istituzioni promuovono incentivi per operatori che adottano pratiche sostenibili",
        "Istituzioni recepiscono direttive e linee guida europee",
        "Istituzioni regionali favoriscono la creazione di reti",
        "Comunità locali fanno pressione per richiedere gestione sostenibile",
        "ONG informano su importanza certificazione/modelli di cogestione",
        "Enti di ricerca condividono dati su benefici cogestione",
        "Banche e fondazioni investono sul territorio",
    ],
    "R1.4": [
        "NNR/ISPRA/UNI/Centri fanno ricerca e raccolta dati per analisi modelli ecosistemici",
        "ONG organizza tavoli di discussione con pubblica amministrazione, centri di ricerca e attività produttive",
        "Settore energetico segue linee guida della pianificazione dello spazio marittimo",
        "Associazioni di categoria coordinano e promuovono pratiche di transizione sostenibile",
        "Filiera mercato è consapevole degli impatti ambientali e dei benefici della blue economy sostenibile",
        "ONG implementano progetti pilota di blue economy sostenibile con le comunità locali",
        "ONG promuovono campagne di sensibilizzazione",
        "Università danno borse di studio per finanziare ricerca, raccolta dati e promuovere capacity",
    ],
    "R2.1": [
        "EU aumenta passing per green deal",
        "SNAM immette servizi ecosistemici nella manutenzione e valorizzazione conservazione",
        "Enti di formazione e associazioni sensibilizzano sull’importanza della gestione sostenibile",
        "Aziende sviluppano linee sostenibili",
        "Consumatori richiedono prodotti e servizi sostenibili e tracciabili",
        "Media aumentano sensibilizzazione e consapevolezza",
        "Forze dell’ordine aumentano controllo e vigilanza",
    ],
    "R2.2": [
        "Università/ISPRA supportano tecnicamente gli enti competenti",
        "ISPRA/Università, Comunità locali e Regioni co-progettano con ONG",
        "ONG fanno lobby sull’importanza del rewilding",
        "ONG sensibilizzano sull’importanza del rewilding",
        "Aziende e fondazioni destinano maggiori fondi per azioni ambientali",
        "Cittadini fanno pressione sulla politica",
    ],
    "R2.3": [
        "Enti preposti formano formazione ai magistrati sulla legislazione e tutela biodiversità",
        "Sistema legislativo nazionale e regionale migliora la legislazione in materia di crimini di natura",
        "Scuole formano i giovani sul rispetto della natura",
        "ONG sensibilizzano le comunità locali sul rispetto della natura",
        "ONG avviano percorsi di coinvolgimento delle comunità locali",
        "Media diffondono la tematica al grande pubblico",
        "Consumatori prediligono prodotti legali",
        "ONG promuovono azioni giudiziarie",
    ],
    "R2.4": [
        "ONG ingaggiano portatori di interesse per formazione ed attività pilota",
        "Enti di ricerca e ONG definiscono e sviluppano piani di azione",
        "ONG ambientaliste fanno lobby sull’importanza del tema della coesistenza",
        "Media migliorano comunicazione science-based",
        "Istituzioni regionali erogano formazione e training",
        "ONG ed enti di ricerca collaborano e condividono informazioni sul tema della coesistenza",
        "Scuola",
        "ONG",
    ],
    "R3.1": [
        "Associazioni consumatori e sindacati fanno lobby e advocacy sulla corretta attuazione della direttiva UE sul PAC",
        "Associazioni ambientaliste fanno lobby e advocacy per promuovere riforma PAC",
        "Associazioni ambientaliste e salute promuovono i benefici agroecologia",
        "Agenzie tecniche forniscono metodologie e buone pratiche",
        "UNI e AIDA definiscono norme e linee guida per agroecologia",
        "Enti di ricerca e università sperimentano nuove metodologie formando",
    ],
    "R3.2": [
        "Ministero Salute adotta nuove linee guida",
        "Ministero Salute fa una campagna di comunicazione sui benefici dieta sana",
        "Centri di ricerca e università forniscono dati e metodi",
        "Associazioni di categoria influenzano assistiti sui benefici della produzione a basso impatto",
        "Medici informano pazienti e cittadini",
        "Ambassador sensibilizzano su dieta sana e priva di carne",
        "ONG avviano percorso con la GDO",
        "ONG promuovono meat free week",
        "ONG promuovono criteri di sostenibilità per beni, prodotti e servizi",
        "ONG fanno pressione su policy maker anche a livello UE",
    ],
    "R3.3": [
        "ONG/aziende fanno pressione perché economia circolare diventi uno dei pilastri dei programmi di pianificazione e sviluppo",
        "ONG fanno informazione su true e fake sustainability",
        "Scuola potenzia settori professionali che promuovono economia circolare",
        "Enti di ricerca studiano e propongono soluzioni tecniche innovative",
        "ONG sviluppano progetti congiuntamente con altri portatori di interesse",
        "Aziende adottano soluzioni innovative, certificazioni ed etichette volontarie sulla sostenibilità",
        "Media informano su soluzioni e benefici",
    ],
    "R4.1": [
        "Associazioni e sindacati premono per sistema trasporti decarbonizzato",
        "Regioni scelgono aree di accelerazione per le rinnovabili",
        "Enti di ricerca forniscono info scientifiche",
        "Ministero Economia finanzia la transizione",
        "Banche e fondi prediligono investimenti green",
        "Associazioni ambientaliste fanno formazione",
        "Retailer e rappresentanze bio promuovono best practices",
        "Media divulgano informazione e indagini",
        "Associazioni ambientaliste e associazioni di categoria fanno lobby",
    ],
    "R4.2": [
        "Sindacati inseriscono il tema delle misure di adattamento nella contrattazione collettiva",
        "Settore turistico, medici e ONG comitati cittadini chiedono piani di prevenzione degli effetti del cambiamento climatico",
        "Associazioni ambientaliste e cittadini attivi ottengono percorsi partecipativi ai piani e alle azioni di adattamento",
        "Aziende sviluppano tecnologie e servizi",
        "Associazioni ambientaliste sviluppano progetti di nature-based solution",
        "Enti di ricerca forniscono nature-based solution in ambito urbano",
        "Media producono contenuti di valore su importanza adattamento",
        "Banche finanziano progetti di adattamento",
    ],
    "R4.3": [
        "Operatori energetici aumentano offerta rinnovabili",
        "Start-up crea un sistema di misurazione impegni",
        "CER facilita la creazione di comunità di cittadini",
        "CER aumenta offerta energie rinnovabili",
        "ONG sensibilizzano i cittadini sugli strumenti di attivazione/partecipativi",
        "ONG diffondono competenze e fanno pressione su istituzioni",
        "Ambassador e influencer influenzano tramite esempio e promuovono challenges",
        "Ministero e Parlamento definiscono misure per favorire le rinnovabili",
    ],
    "R5.a": [
        "Associazioni ambientaliste ed ETS formano gli attori chiave del sistema istituzionale su risposte scientifiche/efficaci",
        "WWF ed ETS valorizzano il ruolo dei volontari e delle comunità locali nei territori",
        "Associazioni, ETS e Università/Ricerca scientifica orientano la lettura dei fenomeni in senso scientifico/sostenibile",
    ],
    "R5.b": [
        "Istituzioni attuano politiche ambientali efficaci",
        "Le istituzioni e i partiti politici agiscono in coerenza con gli obiettivi di Our Values",
        "Fondi UE e fondi strutturali e coesione sociale maggiormente orientati alla sostenibilità",
    ],
    "R5.c": [
        "Associazioni Ambientaliste ed ETS sensibilizzano il consumatore",
        "Associazioni Ambientaliste ed ETS sviluppano partnership di corporate engagement sulla sostenibilità",
        "Le associazioni di categoria promuovono il modello virtuoso presso gli associati e le istituzioni",
        "Istituti finanziari privati investono in attività economiche sostenibili",
    ],
    "R6.a": [
        "WWF diffonde i contenuti di Our Values tramite accordi quadro con MIM e MUR",
        "Società di certificazione integrano criteri di valutazione sostenibili nei processi di certificazione",
        "Istituzioni e aziende migliorano la disponibilità di spazi e servizi green",
    ],
    "R6.b": [
        "Associazioni ambientaliste promuovono e incrementano l’offerta di natura alla cittadinanza",
        "Comunità e amministrazioni locali richiedono spazi e servizi green",
    ],
    "R6.c": [
        "Comissioni tematiche presidiano il rispetto dei contenuti Our Values",
        "Società di produzione e fondi di finanziamento orientano contenuti coerenti con Our Values",
        "Pubblico fruisce maggiormente contenuti in linea con Our Values",
        "Opinion leader veicolano contenuti coerenti con Our Values",
    ],
}

nodes, links = [], []

goal_children = {gid: [oid for oid, g, _ in objectives if g == gid] for gid, _ in goals}
objective_children = {oid: [rid for rid, o, _ in results if o == oid] for oid, _, _ in objectives}
result_order = {rid: idx for idx, (rid, _, _) in enumerate(results)}
objective_order = {oid: sum(result_order[rid] for rid in rids) / len(rids) for oid, rids in objective_children.items()}
goal_order = {
    gid: sum(objective_order[oid] for oid in oids) / len(oids)
    for gid, oids in goal_children.items()
}

for gid, label in goals:
    nodes.append(n(gid, f"{gid}: {label}", "goal", "Programma WWF Italia 2026, p. 14", x_order=goal_order[gid], level=1))
for oid, gid, label in objectives:
    nodes.append(n(oid, f"{oid}: {label}", "objective", "Programma WWF Italia 2026, p. 14", x_order=objective_order[oid], level=2))
    links.append({"source": gid, "target": oid, "type": "formal"})
for rid, oid, label in results:
    note = "Carta ToC risultato specifico" if rid in level4_activities and not rid.startswith(("R5", "R6")) else "Carta aggregata Obiettivo 5/6: allocazione prudenziale da verificare"
    nodes.append(n(rid, f"{rid}: {label}", "result", f"Programma WWF Italia 2026, p. 14; {note}", x_order=result_order[rid], level=3))
    links.append({"source": oid, "target": rid, "type": "formal"})
    for i, label4 in enumerate(level4_activities.get(rid, []), 1):
        cid = f"{rid}_L4_{i}"
        nodes.append(
            n(
                cid,
                label4,
                "toc_element",
                f"{rid} · livello 4: primo livello di quadrati sotto l’ovale del risultato",
                map_id=rid,
                line=i,
                x_order=result_order[rid] + (i - (len(level4_activities.get(rid, [])) + 1) / 2) * 0.055,
                level=4,
                visible=True,
            )
        )
        links.append({"source": rid, "target": cid, "type": "map_membership"})
    for i, label5 in enumerate(level5.get(rid, []), 1):
        cid = f"{rid}_L5_{i}"
        nodes.append(
            n(
                cid,
                label5,
                "toc_level5",
                f"{rid} · livello 5: secondo livello leggibile sotto l’ovale del risultato; relazione precisa L4→L5 da verificare sulla mappa",
                map_id=rid,
                line=i,
                x_order=result_order[rid] + (i - (len(level5.get(rid, [])) + 1) / 2) * 0.034,
                level=5,
                visible=True,
            )
        )
        links.append({"source": rid, "target": cid, "type": "level5_context"})

raw_maps = {
    rid: {
        "lines": vals + [f"[L5] {x}" for x in level5.get(rid, [])],
        "note": "Livelli 4 e 5 rappresentati; livelli 6+ non représentés dans cette vue. Le relazioni precise L4→L5 richiedono una verifica visiva carta per carta."
        + (" Allocation prudenziale: carte source agrégée par objectif." if rid.startswith(("R5", "R6")) else ""),
    }
    for rid, vals in level4_activities.items()
}

Path("network-data.json").write_text(
    json.dumps(
        {
            "metadata": {
                "title": "WWF Italia ToC macro-réseau 5 livelli",
                "scope": "Livello 1 Goal strategici; livello 2 Obiettivi; livello 3 Risultati ufficiali; livello 4 attività direttamente sotto l’ovale del risultato; livello 5 attività immediatamente sotto il primo livello.",
                "excluded": "Elementi illeggibili e livelli più profondi non rappresentati. Le relazioni precise L4→L5 richiedono verifica visiva carta per carta.",
            },
            "nodes": nodes,
            "links": links,
            "raw_maps": raw_maps,
        },
        ensure_ascii=False,
        indent=2,
    ),
    encoding="utf-8",
)
