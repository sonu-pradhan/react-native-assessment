import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { COLORS, SPACING } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { signInWithGoogle, loading, error } = useAuth();

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.container}>
                <View style={styles.brandContainer}>
                    <Text style={styles.brand}>hb+</Text>
                    <Text style={styles.brandLabel}>
                        MEMBER PORTAL
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.heading}>
                        Welcome to a healthier you.
                    </Text>

                    <Text style={styles.description}>
                        Sign in to access your HB+ member
                        account and personal space.
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.googleButton,
                            (pressed || loading) && styles.buttonPressed,
                        ]}
                        onPress={signInWithGoogle}
                        disabled={loading}
                        accessibilityRole="button"
                        accessibilityLabel="Continue with Google"
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <>
                                <Text style={styles.googleLetter}>G</Text>
                                <Text style={styles.googleButtonText}>
                                    Continue with Google
                                </Text>
                            </>
                        )}
                    </Pressable>

                    {error && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>
                                {error}
                            </Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.notice}>
                        <Text style={styles.noticeText}>
                            Access is restricted to verified
                            @hbplus.fit organization accounts.
                        </Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    BODY  ·  GUT  ·  MIND
                </Text>

                <Text style={styles.copyright}>
                    © HB+ · Member Access
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        minHeight: 650,
        backgroundColor: COLORS.background,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xl,
    },
    brandContainer: {
        alignItems: "center",
        marginBottom: SPACING.xl,
    },
    brand: {
        fontSize: 42,
        fontWeight: "800",
        color: COLORS.primary,
        letterSpacing: -2,
    },
    brandLabel: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 3,
        color: COLORS.muted,
        marginTop: 2,
    },
    card: {
        width: "100%",
        maxWidth: 440,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    heading: {
        fontSize: 29,
        fontWeight: "700",
        color: COLORS.primary,
        lineHeight: 36,
        letterSpacing: -0.8,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.muted,
        marginTop: SPACING.md,
        marginBottom: SPACING.xl,
    },
    googleButton: {
        minHeight: 54,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    googleLetter: {
        fontSize: 19,
        fontWeight: "800",
        color: "#4285F4",
    },
    googleButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.text,
    },
    buttonPressed: {
        opacity: 0.7,
    },
    errorBox: {
        marginTop: SPACING.md,
        backgroundColor: "#FDECEC",
        borderWidth: 1,
        borderColor: "#F5C2C2",
        borderRadius: 10,
        padding: SPACING.md,
    },
    errorText: {
        color: "#B42318",
        fontSize: 13,
        lineHeight: 19,
        textAlign: "center",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.lg,
    },
    notice: {
        backgroundColor: "#F5F7F2",
        borderRadius: 10,
        padding: SPACING.md,
    },
    noticeText: {
        fontSize: 12,
        lineHeight: 19,
        color: COLORS.muted,
        textAlign: "center",
    },
    footer: {
        marginTop: SPACING.xl,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 2,
        color: COLORS.primary,
    },
    copyright: {
        marginTop: SPACING.sm,
        fontSize: 11,
        color: COLORS.muted,
    },
});