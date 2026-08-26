import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { FaqsService } from './faqs.service';

@Component({
    selector: 'app-faqs',
    standalone: false,
    templateUrl: './faqs.component.html',
    styleUrl: './faqs.component.scss'
})
export class FaqsAdminComponent implements OnInit {

    // ── Topics ────────────────────────────────────────────────────────────────
    topics: any[] = [];
    topicsLoading = true;
    newTopicName = '';
    editingTopic: any = null;

    // ── FAQs ──────────────────────────────────────────────────────────────────
    faqs: any[] = [];
    faqsLoading = false;
    selectedTopicId: number | null = null;

    showFaqForm = false;
    editingFaq: any = null;
    faqForm = { topicId: null as number | null, question: '', answer: '', sortOrder: 0, isActive: true };

    // ── Config ────────────────────────────────────────────────────────────────
    config: any = { pageTitle: 'FAQs', bannerImage: '' };
    configSaving = false;

    activeTab: 'faqs' | 'config' = 'faqs';

    constructor(
        public sharedService: SharedService,
        private faqsService: FaqsService
    ) {}

    ngOnInit(): void {
        this.loadTopics();
        this.loadFaqs();
        this.loadConfig();
    }

    // ── Topics ────────────────────────────────────────────────────────────────
    loadTopics() {
        this.topicsLoading = true;
        this.faqsService.getTopics().subscribe({
            next: (res: any) => { this.topics = res.data || []; this.topicsLoading = false; },
            error: () => { this.topicsLoading = false; }
        });
    }

    addTopic() {
        const name = this.newTopicName.trim();
        if (!name) return;
        this.faqsService.createTopic({ name, sortOrder: this.topics.length + 1 }).subscribe({
            next: () => { this.newTopicName = ''; this.loadTopics(); this.sharedService.showAlert(1, 'Topic added'); },
            error: () => this.sharedService.showAlert(3, 'Failed to add topic')
        });
    }

    startEditTopic(t: any) { this.editingTopic = { ...t }; }

    saveEditTopic() {
        if (!this.editingTopic?.name?.trim()) return;
        this.faqsService.updateTopic(this.editingTopic.id, this.editingTopic).subscribe({
            next: () => { this.editingTopic = null; this.loadTopics(); this.sharedService.showAlert(1, 'Topic updated'); },
            error: () => this.sharedService.showAlert(3, 'Failed to update topic')
        });
    }

    deleteTopic(id: number) {
        if (!confirm('Delete this topic? All FAQs under it will lose their topic.')) return;
        this.faqsService.deleteTopic(id).subscribe({
            next: () => { this.loadTopics(); this.loadFaqs(); this.sharedService.showAlert(1, 'Topic deleted'); },
            error: () => this.sharedService.showAlert(3, 'Failed to delete topic')
        });
    }

    // ── FAQs ──────────────────────────────────────────────────────────────────
    loadFaqs() {
        this.faqsLoading = true;
        this.faqsService.getFaqs(this.selectedTopicId).subscribe({
            next: (res: any) => { this.faqs = res.data || []; this.faqsLoading = false; },
            error: () => { this.faqsLoading = false; }
        });
    }

    filterByTopic(id: number | null) {
        this.selectedTopicId = id;
        this.loadFaqs();
    }

    openAddFaq() {
        this.editingFaq = null;
        this.faqForm = { topicId: this.selectedTopicId, question: '', answer: '', sortOrder: this.faqs.length + 1, isActive: true };
        this.showFaqForm = true;
    }

    openEditFaq(faq: any) {
        this.editingFaq = faq;
        this.faqForm = { topicId: faq.topicId, question: faq.question, answer: faq.answer, sortOrder: faq.sortOrder, isActive: !!faq.isActive };
        this.showFaqForm = true;
    }

    saveFaq() {
        if (!this.faqForm.question.trim() || !this.faqForm.answer.trim()) {
            this.sharedService.showAlert(2, 'Question and answer are required');
            return;
        }
        const obs = this.editingFaq
            ? this.faqsService.updateFaq(this.editingFaq.id, this.faqForm)
            : this.faqsService.createFaq(this.faqForm);

        obs.subscribe({
            next: () => {
                this.showFaqForm = false;
                this.loadFaqs();
                this.sharedService.showAlert(1, this.editingFaq ? 'FAQ updated' : 'FAQ added');
            },
            error: () => this.sharedService.showAlert(3, 'Failed to save FAQ')
        });
    }

    deleteFaq(id: number) {
        if (!confirm('Delete this FAQ?')) return;
        this.faqsService.deleteFaq(id).subscribe({
            next: () => { this.loadFaqs(); this.sharedService.showAlert(1, 'FAQ deleted'); },
            error: () => this.sharedService.showAlert(3, 'Failed to delete FAQ')
        });
    }

    getTopicName(id: number): string {
        return this.topics.find(t => t.id === id)?.name || '—';
    }

    // ── Config ────────────────────────────────────────────────────────────────
    loadConfig() {
        this.faqsService.getConfig().subscribe({
            next: (res: any) => { if (res.data) this.config = { ...res.data }; },
            error: () => {}
        });
    }

    async uploadBanner() {
        const result = await this.sharedService.UploadFile('faqs', null, 'image');
        if (result?.url) this.config.bannerImage = result.url;
    }

    saveConfig() {
        this.configSaving = true;
        this.faqsService.upsertConfig(this.config).subscribe({
            next: () => { this.configSaving = false; this.sharedService.showAlert(1, 'Config saved'); },
            error: () => { this.configSaving = false; this.sharedService.showAlert(3, 'Failed to save config'); }
        });
    }
}
