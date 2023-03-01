import Link from "next/link";
import H1 from "../../components/util/H1";
import { getAllYearAndMonth } from "../../src/lib/db";

export default async function ArchivePage() {
    const distinction = await getAllYearAndMonth();

    return <>
        <H1>月別アーカイブ</H1>
    </>
}
